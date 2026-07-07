import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "../hooks/LanguageProvider";
import { toast, Bounce } from "react-toastify";
import {
  TransportRequestInterface,
  TransportRequestResponsibleOption,
} from "../types/transportRequest.types";

import TransportRequestHeader from "../components/TransportRequest/Header";
import TransportRequestTypeCard from "../components/TransportRequest/TypeCard";
import TransportRequestDepartureCard from "../components/TransportRequest/DepartureCard";
import TransportRequestArrivalCard from "../components/TransportRequest/ArrivalCard";
import TransportRequestDetailsCard from "../components/TransportRequest/DetailsCard";
import TransportRequestBottomBar from "../components/TransportRequest/BottomBar";
import {
  createTransportRequestApi,
  getTransportRequestResponsiblesApi,
} from "../services/transportRequest.service";

const id_user = localStorage.getItem("GeopUserID");

export function TransportRequestManage() {
  const navigate = useNavigate();
  const { translate } = useTranslate();

  const [buttonClicked, setButtonClicked] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [responsibles, setResponsibles] = useState<TransportRequestResponsibleOption[]>(
    []
  );
  const [isLoadingResponsibles, setIsLoadingResponsibles] = useState(false);

  const [request, setRequest] = useState<TransportRequestInterface>({
    object_request: "",
    request_type: "Normal",
    requester_phone: "",
    requester_email: "",
    id_gp_demandeur: null,
    departure_datetime: null,
    departure_location: "",
    arrival_datetime: null,
    arrival_location: "",
    id_gp_responsable: null,
    id_user: id_user,
    status_request: "pending",
  });

  useEffect(() => {
    const loadResponsibles = async () => {
      setIsLoadingResponsibles(true);

      try {
        const data = await getTransportRequestResponsiblesApi("");
        setResponsibles(data);
      } catch (error) {
        console.error("Load responsibles error:", error);
        setResponsibles([]);
      } finally {
        setIsLoadingResponsibles(false);
      }
    };

    loadResponsibles();
  }, []);

  const cancelClicked = () => {
    navigate("");
  };

  const formatToDatetimeLocal = (
    isoString: string | null | undefined
  ): string => {
    if (!isoString) return "";

    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";

      const pad = (num: number) => num.toString().padStart(2, "0");

      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } catch {
      return "";
    }
  };

  const parseDatetimeLocal = (localString: string): string | null => {
    if (!localString) return null;

    try {
      const [datePart, timePart] = localString.split("T");
      return `${datePart}T${timePart || "00:00"}:00`;
    } catch {
      return null;
    }
  };

  const validateDates = (
    departure: string | null,
    arrival: string | null
  ): boolean => {
    if (!departure || !arrival) return true;
    return new Date(departure) <= new Date(arrival);
  };

  const handleDateTimeChange = (name: string, value: string) => {
    const isoValue = parseDatetimeLocal(value);

    const updatedRequest: TransportRequestInterface = {
      ...request,
      [name]: isoValue,
    };

    setRequest(updatedRequest);

    if (updatedRequest.departure_datetime && updatedRequest.arrival_datetime) {
      const isValid = validateDates(
        updatedRequest.departure_datetime,
        updatedRequest.arrival_datetime
      );

      setDateError(
        isValid
          ? null
          : translate("departure_time_must_be_earlier_than_or_equal_to_arrival_time")
      );
    } else {
      setDateError(null);
    }
  };

  const handleChange = (
    name: keyof TransportRequestInterface,
    value: string | number | null
  ) => {
    setRequest((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "requester_email" ? { id_gp_demandeur: null } : {}),
    }));
  };

  const handleResponsibleChange = (id_responsable: number | null) => {
    const responsible = responsibles.find(
      (item) => item.id_responsable === id_responsable
    );

    setRequest((prev) => ({
      ...prev,
      id_gp_demandeur: null,
      id_gp_responsable: responsible?.id_responsable || null,
      requester_email: responsible?.email_responsable || "",
      requester_phone: responsible?.phone || "",
    }));
  };

  const createTransportRequest = async () => {
    if (buttonClicked) {
      toast.warn(translate("request_is_already_being_sent"), {
        position: "bottom-right",
        autoClose: 2400,
        transition: Bounce,
      });
      return;
    }

    setButtonClicked(true);

    try {
      if (!request.object_request.trim()) {
        toast.warn(translate("object_is_required"), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      if (!request.requester_phone.trim()) {
        toast.warn(translate("phone_number_is_required"), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      if (!request.departure_location.trim()) {
        toast.warn(translate("departure_point_is_required"), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      if (!request.arrival_location.trim()) {
        toast.warn(translate("arrival_point_is_required"), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      if (!request.departure_datetime || !request.arrival_datetime) {
        toast.warn(translate("departure_and_arrival_times_are_required"), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      if (!request.requester_email?.trim()) {
        toast.warn(translate("requester_is_required"), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(request.requester_email.trim())) {
        toast.warn(translate("invalid_requester_email"), {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      if (dateError) {
        toast.warn(dateError, {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        });
        return;
      }

      const payload: TransportRequestInterface = {
        ...request,
        requester_email: request.requester_email.trim().toLowerCase(),
        id_gp_demandeur: request.id_gp_demandeur || null,
        id_gp_responsable: request.id_gp_responsable || null,
        departure_datetime: request.departure_datetime
          ? request.departure_datetime.replace("T", " ")
          : null,
        arrival_datetime: request.arrival_datetime
          ? request.arrival_datetime.replace("T", " ")
          : null,
      };

      const result = await createTransportRequestApi(payload);

      toast.success(
        result.message || translate("transport_request_created_successfully"),
        {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        }
      );

      setButtonClicked(false);
      navigate("");
    } catch (error: any) {
      console.error("Create transport request error:", error);

      toast.error(
        error?.message ||
        translate("an_error_occurred_while_creating_the_transport_request"),
        {
          position: "bottom-right",
          autoClose: 2400,
          transition: Bounce,
        }
      );
    } finally {
      setButtonClicked(false);
    }
  };

  return (
    <>
      <div className="transport-request-page">
        <TransportRequestHeader translate={translate} />

        <TransportRequestTypeCard
          translate={translate}
          requestType={request.request_type}
          onChange={(value) => handleChange("request_type", value)}
        />

        <TransportRequestDepartureCard
          translate={translate}
          departureDatetime={request.departure_datetime}
          departureLocation={request.departure_location}
          dateError={dateError}
          formatToDatetimeLocal={formatToDatetimeLocal}
          onDateChange={handleDateTimeChange}
          onTextChange={handleChange}
        />

        <TransportRequestArrivalCard
          translate={translate}
          arrivalDatetime={request.arrival_datetime}
          arrivalLocation={request.arrival_location}
          dateError={dateError}
          formatToDatetimeLocal={formatToDatetimeLocal}
          onDateChange={handleDateTimeChange}
          onTextChange={handleChange}
        />

        <TransportRequestDetailsCard
          translate={translate}
          objectRequest={request.object_request}
          requesterPhone={request.requester_phone}
          selectedResponsibleId={request.id_gp_responsable || null}
          responsibles={responsibles}
          isLoadingResponsibles={isLoadingResponsibles}
          onTextChange={handleChange}
          onResponsibleChange={handleResponsibleChange}
        />
      </div>

      <TransportRequestBottomBar
        translate={translate}
        buttonClicked={buttonClicked}
        onCancel={cancelClicked}
        onSubmit={createTransportRequest}
      />
    </>
  );
}

export default TransportRequestManage;
