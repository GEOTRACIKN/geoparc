import { getNotificationType } from "../config/notificationTypes";



import React, {

  useCallback,

  useEffect,

  useMemo,

  useRef,

  useState,

} from "react";



import {

  Button,

  Dropdown,

  Modal,

  Table,

} from "react-bootstrap";



import { Link } from "react-router-dom";

import ReactPaginate from "react-paginate";



import { getNotificationRoute } from "../utilities/notificationRoute";



import { useTranslate } from "../hooks/LanguageProvider";

import { useClipboard } from "../utilities/functions";



import { PropagateLoader } from "react-spinners";

import { useGpPagePreferences } from "../hooks/useGpPagePreferences";



import {

  deleteNotification,

  getNotificationDetail,

  getNotificationsTotalPage,

  searchNotifications,

  updateNotification,

} from "../services/notificationApi";



/* ============================================================

   COLONNES

   ============================================================ */



const notificationDefaultColumns = {

  id_notification: true,

  name_groupe_alarme: true,

  name_alarme: true,

  message: true,

  attached: true,

  timestamp: true,

  date_modification: true,

  infos: true,

};



type NotificationColumn =

  keyof typeof notificationDefaultColumns;



/* ============================================================

   PREFERENCES

   ============================================================ */



const notificationPreferenceDefaults = {

  visibleColumns: [

    "name_groupe_alarme",

    "name_alarme",

    "message",

    "attached",

    "timestamp",

    "date_modification",

    "infos",

  ],



  pageSize: 10,

  searchType: 0,

  searchText: "",

  sortColumn: "timestamp",

  sortDirection: "DESC",



  filters: {

    columnsVersion: 3,

  } as Record<string, unknown>,



  selectedVehicleId: null as number | null,

};



/* ============================================================

   TYPES

   ============================================================ */



interface NotificationsProps {

  id_notification: number;



  id_alarme?: number | null;

  id_alarm?: number | null;



  id_groupe_alarme?: number | null;



  name_groupe_alarme?: string | null;

  name_alarme?: string | null;



  id_user: number;



  id_item?: number | null;

  id_type?: number | null;



  type?: string | null;

  message?: string | null;

  severity?: number | null;



  timestamp?: string | null;

  date_modification?: string | null;



  state?: number | null;



  attached?: number | null;



  item_name?: string | null;



  immatriculation_vehicule?: string | null;



  training_prenom_conducteur?: string | null;

  training_nom_conducteur?: string | null;



  feu_immatriculation_vehicule?: string | null;



  prenom_conducteur?: string | null;

  nom_conducteur?: string | null;

}



/* ============================================================

   TRI

   ============================================================ */



const SORTABLE_COLUMNS = new Set([

  "id_notification",

  "message",

  "timestamp",

]);



/* ============================================================

   PAGE

   ============================================================ */



export function Notifications() {

  const { translate } = useTranslate();



  const id_user =

    localStorage.getItem("GeopUserID");



  const canViewNotificationId =

    id_user === "1";



  /* ============================================================

     PAGINATION

     ============================================================ */



  const [limit, setLimit] =

    useState(10);



  const [

    currentPage,

    setCurrentPage,

  ] = useState<number>(1);



  const [

    pageCount,

    setPageCount,

  ] = useState(0);



  const [

    total,

    setTotal,

  ] = useState(0);



  /* ============================================================

     DONNEES

     ============================================================ */



  const [

    list_Alarms,

    setAlarms,

  ] = useState<NotificationsProps[]>([]);



  const [

    loading,

    setLoading,

  ] = useState(true);



  /* ============================================================

     RECHERCHE / TRI

     ============================================================ */



  const [

    search,

    setSearch,

  ] = useState("");



  const [

    type,

    setType,

  ] = useState(0);



  const [

    colum,

    setSortColum,

  ] = useState("timestamp");



  const [

    sort,

    setSort,

  ] = useState("DESC");



  /* ============================================================

     ERREUR

     ============================================================ */



  const [

    apiError,

    setApiError,

  ] = useState<string | null>(

    null

  );



  /* ============================================================

     DETAILS / ACTIONS

     ============================================================ */



  const [

    selectedNotification,

    setSelectedNotification,

  ] = useState<NotificationsProps | null>(

    null

  );



  const [

    detailLoading,

    setDetailLoading,

  ] = useState(false);



  const [

    actionLoadingId,

    setActionLoadingId,

  ] = useState<number | null>(

    null

  );



  /* ============================================================

     COPIER

     ============================================================ */



  const {

    copyToClipboard,

    copiedId,

  } = useClipboard(

    translate(

      "Matriculation Copied"

    )

  );



  /* ============================================================

     RECHERCHE

     ============================================================ */



  const notificationSearchOptions =

    useMemo(

      () => [

        {

          type: 0,

          label: translate(

            "Notification ID"

          ),

        },



        {

          type: 1,

          label: translate(

            "Groupe"

          ),

        },



        {

          type: 2,

          label: translate(

            "Alertes"

          ),

        },



        {

          type: 3,

          label: translate(

            "Détails"

          ),

        },



        {

          type: 4,

          label: translate(

            "Attaché à"

          ),

        },



        {

          type: 5,

          label: translate(

            "Date de début"

          ),

        },



        {

          type: 6,

          label: translate(

            "Date de fin"

          ),

        },

      ],

      [translate]

    );



  const typeSearch =

    notificationSearchOptions.find(

      (option) =>

        option.type === type

    )?.label ||

    translate(

      "Notification ID"

    );



  /* ============================================================

     COLONNES

     ============================================================ */



  const [

    selectedColumns,

    setSelectedColumns,

  ] = useState({

    ...notificationDefaultColumns,



    id_notification:

      canViewNotificationId,

  });



  /* ============================================================

     PREFERENCES

     ============================================================ */



  const {

    preferences:

      notificationPreferences,



    setPreferences:

      saveNotificationPreferences,



    resetPreferences:

      resetNotificationPreferences,



    loaded:

      notificationPreferencesLoaded,



    saving:

      notificationPreferencesSaving,

  } = useGpPagePreferences(

    "notifications",

    notificationPreferenceDefaults

  );



  const

    notificationPreferencesHydratedRef =

      useRef(false);



  const [

    notificationPreferencesReady,

    setNotificationPreferencesReady,

  ] = useState(false);



  /* ============================================================

     CHARGER PREFERENCES

     ============================================================ */



  useEffect(() => {

    if (

      !notificationPreferencesLoaded ||

      notificationPreferencesHydratedRef

        .current

    ) {

      return;

    }



    notificationPreferencesHydratedRef

      .current = true;



    setSelectedColumns({

      ...notificationDefaultColumns,



      id_notification:

        canViewNotificationId,

    });



    const savedPageSize =

      Number(

        notificationPreferences

          .pageSize

      );



    setLimit(

      savedPageSize > 0

        ? savedPageSize

        : 10

    );



    const savedSearchType =

      Number(

        notificationPreferences

          .searchType

      );



    setType(

      notificationSearchOptions.some(

        (option) =>

          option.type ===

          savedSearchType

      )

        ? savedSearchType

        : 0

    );



    setSearch(

      String(

        notificationPreferences

          .searchText ||

          ""

      )

    );



    const savedSortColumn =

      String(

        notificationPreferences

          .sortColumn ||

          "timestamp"

      );



    setSortColum(

      SORTABLE_COLUMNS.has(

        savedSortColumn

      )

        ? savedSortColumn

        : "timestamp"

    );



    setSort(

      String(

        notificationPreferences

          .sortDirection

      ).toUpperCase() ===

        "ASC"

        ? "ASC"

        : "DESC"

    );



    setNotificationPreferencesReady(

      true

    );

  }, [

    canViewNotificationId,

    notificationPreferences,

    notificationPreferencesLoaded,

    notificationSearchOptions,

  ]);



  /* ============================================================

     SAUVEGARDER PREFERENCES

     ============================================================ */



  useEffect(() => {

    if (

      !notificationPreferencesReady

    ) {

      return;

    }



    void saveNotificationPreferences({

      visibleColumns: [

        "name_groupe_alarme",

        "name_alarme",

        "message",

        "attached",

        "timestamp",

        "date_modification",

        "infos",



        ...(canViewNotificationId

          ? [

              "id_notification",

            ]

          : []),

      ],



      pageSize:

        Number(limit),



      searchType:

        type,



      searchText:

        search,



      sortColumn:

        colum,



      sortDirection:

        sort,



      filters: {

        columnsVersion: 3,

      },

    });

  }, [

    canViewNotificationId,

    colum,

    limit,

    notificationPreferencesReady,

    saveNotificationPreferences,

    search,

    sort,

    type,

  ]);



  /* ============================================================

     API

     ============================================================ */



  const getNotifications =

    useCallback(

      async (

        limitValue: number,

        currentPageValue: number,

        searchValue: string,

        typeValue: number,

        columnValue: string,

        sortValue: string

      ) => {

        if (!id_user) {

          setApiError(

            translate(

              "User ID is missing"

            )

          );



          setLoading(false);



          return;

        }



        try {

          setLoading(true);



          setApiError(null);



          const [

            totalPagesJson,

            data,

          ] =

            await Promise.all([

              getNotificationsTotalPage({

                id_user,



                search:

                  searchValue,



                type:

                  typeValue,

              }),



              searchNotifications({

                limitValue,



                currentPage:

                  currentPageValue,



                search:

                  searchValue,



                type:

                  typeValue,



                id_user,



                column:

                  columnValue,



                sort:

                  sortValue,

              }),

            ]);



          const totalValue =

            Number(

              totalPagesJson?.[0]

                ?.count ?? 0

            );



          setTotal(

            totalValue

          );



          setPageCount(

            Math.ceil(

              totalValue /

                limitValue

            )

          );



          setAlarms(

            Array.isArray(

              data

            )

              ? data

              : []

          );

        } catch (error) {

          console.error(

            "Error loading notifications:",

            error

          );



          setAlarms([]);



          setTotal(0);



          setPageCount(0);



          setApiError(

            error instanceof Error

              ? error.message

              : translate(

                  "Unable to load notifications"

                )

          );

        } finally {

          setLoading(false);

        }

      },

      [

        id_user,

        translate,

      ]

    );



  /* ============================================================

     RECHARGEMENT

     ============================================================ */



  useEffect(() => {

    if (

      !notificationPreferencesReady

    ) {

      return;

    }



    void getNotifications(

      limit,

      currentPage,

      search,

      type,

      colum,

      sort

    );

  }, [

    colum,

    currentPage,

    getNotifications,

    limit,

    notificationPreferencesReady,

    search,

    sort,

    type,

  ]);



  /* ============================================================

     PAGINATION

     ============================================================ */



  const handlePageClick = (

    data: {

      selected: number;

    }

  ) => {

    setCurrentPage(

      data.selected + 1

    );



    window.scrollTo(

      0,

      0

    );

  };



  /* ============================================================

     LIMITE

     ============================================================ */



  const handleSelectChange = (

    event:

      React.ChangeEvent<

        HTMLSelectElement

      >

  ) => {

    setCurrentPage(1);



    setLimit(

      Number(

        event.target.value

      )

    );



    window.scrollTo(

      0,

      0

    );

  };



  /* ============================================================

     COLONNES

     ============================================================ */



  const handleColumnChange = (

    column:

      NotificationColumn

  ) => {

    if (

      column ===

        "id_notification" &&

      !canViewNotificationId

    ) {

      return;

    }



    setSelectedColumns(

      (current) => ({

        ...current,



        [column]:

          !current[column],

      })

    );

  };



  /* ============================================================

     TYPE RECHERCHE

     ============================================================ */



  const handleTypeSearch = (

    selectedType:

      number

  ) => {

    setType(

      selectedType

    );



    setCurrentPage(1);

  };



  /* ============================================================

     TEXTE RECHERCHE

     ============================================================ */



  const handleAdvancedSearch = (

    event:

      React.ChangeEvent<

        HTMLInputElement

      >

  ) => {

    setSearch(

      event.target.value

    );



    setCurrentPage(1);

  };



  /* ============================================================

     TRI

     ============================================================ */



  const handleSortingColum = (

    currentColumn:

      string

  ) => {

    if (

      !SORTABLE_COLUMNS.has(

        currentColumn

      )

    ) {

      return;

    }



    setCurrentPage(1);



    if (

      colum ===

      currentColumn

    ) {

      setSort(

        (

          currentSort

        ) =>

          currentSort ===

          "ASC"

            ? "DESC"

            : "ASC"

      );



      return;

    }



    setSortColum(

      currentColumn

    );



    setSort(

      "ASC"

    );

  };



  /* ============================================================

     RESET

     ============================================================ */



  const handleResetPreferences =

    async () => {

      try {

        await resetNotificationPreferences();



        setCurrentPage(1);



        setLimit(

          notificationPreferenceDefaults

            .pageSize

        );



        setType(

          notificationPreferenceDefaults

            .searchType

        );



        setSearch(

          notificationPreferenceDefaults

            .searchText

        );



        setSortColum(

          notificationPreferenceDefaults

            .sortColumn

        );



        setSort(

          notificationPreferenceDefaults

            .sortDirection

        );



        setSelectedColumns({

          ...notificationDefaultColumns,



          id_notification:

            canViewNotificationId,

        });



        window.scrollTo(

          0,

          0

        );

      } catch (error) {

        console.error(

          "Error resetting notification preferences:",

          error

        );

      }

    };



  /* ============================================================

     MARQUER LU

     ============================================================ */



  const handleMarkAsRead =

    async (

      alarme:

        NotificationsProps

    ) => {

      if (

        !id_user ||

        alarme.state === 0

      ) {

        return;

      }



      try {

        setActionLoadingId(

          alarme.id_notification

        );



        setApiError(null);



        await updateNotification({

          id_notification:

            alarme.id_notification,



          id_user,

        });



        setAlarms(

          (current) =>

            current.map(

              (item) =>

                item.id_notification ===

                alarme.id_notification

                  ? {

                      ...item,

                      state: 0,

                    }

                  : item

            )

        );



        setSelectedNotification(

          (current) =>

            current &&

            current.id_notification ===

              alarme.id_notification

              ? {

                  ...current,

                  state: 0,

                }

              : current

        );

      } catch (error) {

        console.error(

          "Error updating notification:",

          error

        );



        setApiError(

          error instanceof Error

            ? error.message

            : translate(

                "Unable to update notification"

              )

        );

      } finally {

        setActionLoadingId(

          null

        );

      }

    };



  /* ============================================================

     DETAIL

     ============================================================ */



  const handleViewNotification =

    async (

      alarme:

        NotificationsProps

    ) => {

      if (!id_user) {

        return;

      }



      try {

        setDetailLoading(

          true

        );



        setApiError(null);



        const result =

          await getNotificationDetail(

            alarme.id_notification,

            id_user

          );



        const notification =

          result?.data ||

          alarme;



        setSelectedNotification(

          notification

        );



        if (

          alarme.state === 1

        ) {

          await handleMarkAsRead(

            alarme

          );

        }

      } catch (error) {

        console.error(

          "Error loading notification detail:",

          error

        );



        setSelectedNotification(

          alarme

        );



        setApiError(

          error instanceof Error

            ? error.message

            : translate(

                "Unable to load notification detail"

              )

        );

      } finally {

        setDetailLoading(

          false

        );

      }

    };



  /* ============================================================

     SUPPRESSION

     ============================================================ */



  const handleDeleteNotification =

    async (

      alarme:

        NotificationsProps

    ) => {

      if (!id_user) {

        return;

      }



      const confirmed =

        window.confirm(

          translate(

            "Are you sure you want to delete this notification?"

          )

        );



      if (!confirmed) {

        return;

      }



      try {

        setActionLoadingId(

          alarme.id_notification

        );



        setApiError(null);



        await deleteNotification(

          alarme.id_notification,

          id_user

        );



        const nextPage =

          list_Alarms.length ===

            1 &&

          currentPage > 1

            ? currentPage -

              1

            : currentPage;



        if (

          nextPage !==

          currentPage

        ) {

          setCurrentPage(

            nextPage

          );

        } else {

          await getNotifications(

            limit,

            currentPage,

            search,

            type,

            colum,

            sort

          );

        }

      } catch (error) {

        console.error(

          "Error deleting notification:",

          error

        );



        setApiError(

          error instanceof Error

            ? error.message

            : translate(

                "Unable to delete notification"

              )

        );

      } finally {

        setActionLoadingId(

          null

        );

      }

    };



  /* ============================================================

     DATE

     ============================================================ */



  const formatNotificationDate = (

    value?:

      string | null

  ) => {

    if (!value) {

      return "-";

    }



    const date =

      new Date(value);



    if (

      Number.isNaN(

        date.getTime()

      )

    ) {

      return value;

    }



    return date.toLocaleString(

      "fr-FR",

      {

        timeZone:

          "Africa/Algiers",



        day:

          "2-digit",



        month:

          "2-digit",



        year:

          "numeric",



        hour:

          "2-digit",



        minute:

          "2-digit",



        second:

          "2-digit",



        hour12:

          false,

      }

    );

  };



  /* ============================================================

     ATTACHE A

     ============================================================ */



  const getAttachedValue = (

    alarme:

      NotificationsProps

  ) => {

    if (

      alarme.item_name

    ) {

      return alarme

        .item_name;

    }



    if (

      alarme

        .immatriculation_vehicule

    ) {

      return alarme

        .immatriculation_vehicule;

    }



    if (

      alarme

        .feu_immatriculation_vehicule

    ) {

      return alarme

        .feu_immatriculation_vehicule;

    }



    const driverName = [

      alarme

        .prenom_conducteur,



      alarme

        .nom_conducteur,

    ]

      .filter(Boolean)

      .join(" ");



    if (

      driverName

    ) {

      return driverName;

    }



    const trainingDriverName =

      [

        alarme

          .training_prenom_conducteur,



        alarme

          .training_nom_conducteur,

      ]

        .filter(Boolean)

        .join(" ");



    if (

      trainingDriverName

    ) {

      return trainingDriverName;

    }



    if (

      alarme.id_item !==

        null &&

      alarme.id_item !==

        undefined

    ) {

      return String(

        alarme.id_item

      );

    }



    return "-";

  };



  /* ============================================================

     DESCRIPTION

     ============================================================ */



  const generateDescription = (

    alarme:

      NotificationsProps

  ) => {

    const highlight = (

      value:

        unknown,



      copyKey?:

        string

    ) => {

      const displayValue =

        value === null ||

        value ===

          undefined ||

        value === ""

          ? "-"

          : String(

              value

            );



      const isCopied =

        copiedId ===

        copyKey;



      const color =

        isCopied

          ? "#28a745"

          : "#3b82f6";



      return (

        <span

          onClick={() => {

            if (

              displayValue !==

                "-" &&

              copyKey

            ) {

              copyToClipboard(

                displayValue,

                copyKey

              );

            }

          }}

          title={

            copyKey

              ? translate(

                  "Click to copy"

                )

              : ""

          }

          style={{

            color,



            cursor:

              copyKey

                ? "pointer"

                : "default",



            position:

              "relative",



            fontWeight:

              600,

          }}

        >

          {displayValue}



          {isCopied && (

            <span

              style={{

                position:

                  "absolute",



                top:

                  "-20px",



                left:

                  "50%",



                transform:

                  "translateX(-50%)",



                backgroundColor:

                  "#28a745",



                color:

                  "#fff",



                padding:

                  "2px 5px",



                borderRadius:

                  "4px",



                fontSize:

                  "12px",



                zIndex:

                  10,

              }}

            >

              {translate(

                "Copied"

              )}

            </span>

          )}

        </span>

      );

    };



    const date =

      alarme.timestamp

        ? formatNotificationDate(

            alarme.timestamp

          )

        : "-";



    if (

      !alarme.id_type

    ) {

      return (

        <>

          {alarme.message ||

            "-"}

        </>

      );

    }



    switch (

      Number(

        alarme.id_type

      )

    ) {

      case 1:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The driving license of"

                )}{" "}



                {highlight(

                  alarme.nom_conducteur,



                  `nom-${alarme.id_item}`

                )}{" "}



                {highlight(

                  alarme.prenom_conducteur,



                  `prenom-${alarme.id_item}`

                )}

              </>

            )}

          </>

        );



      case 2:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The insurance for"

                )}{" "}



                {highlight(

                  alarme

                    .immatriculation_vehicule,



                  `immat-${alarme.id_item}`

                )}

              </>

            )}

          </>

        );



      case 3:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The next maintenance for vehicle"

                )}{" "}



                {highlight(

                  alarme

                    .immatriculation_vehicule,



                  `maintenance-${alarme.id_item}`

                )}

              </>

            )}

          </>

        );



      case 4:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The training certificate of"

                )}{" "}



                {highlight(

                  alarme

                    .training_nom_conducteur,



                  `training-nom-${alarme.id_item}`

                )}{" "}



                {highlight(

                  alarme

                    .training_prenom_conducteur,



                  `training-prenom-${alarme.id_item}`

                )}

              </>

            )}

          </>

        );



      case 5:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The fire extinguisher verification for vehicle"

                )}{" "}



                {highlight(

                  alarme

                    .feu_immatriculation_vehicule,



                  `fire-${alarme.id_item}`

                )}

              </>

            )}

          </>

        );



      case 6:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The technical inspection for vehicle"

                )}{" "}



                {highlight(

                  alarme

                    .immatriculation_vehicule,



                  `immat-${alarme.id_item}`

                )}

              </>

            )}

          </>

        );



      case 7:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The vehicle sticker verification for"

                )}{" "}



                {highlight(

                  alarme

                    .immatriculation_vehicule,



                  `immat-${alarme.id_item}`

                )}{" "}



                {translate(

                  "should be done by"

                )}{" "}



                {highlight(

                  date

                )}

              </>

            )}

          </>

        );



      case 8:

        return (

          <>

            {alarme.message || (

              <>

                {translate(

                  "The next oil change for vehicle"

                )}{" "}



                {highlight(

                  alarme

                    .immatriculation_vehicule,



                  `oil-${alarme.id_item}`

                )}

              </>

            )}

          </>

        );



      default: {

        const notificationType =

          getNotificationType(

            alarme.id_type

          );

        return (

          <>

            {notificationType.label}

          </>

        );

      }

    }

  };



  /* ============================================================

     COLSPAN

     ============================================================ */



  const visibleColumnCount =

    1 +

    Object.entries(

      selectedColumns

    ).filter(

      (

        [

          key,

          visible,

        ]

      ) =>

        visible &&

        (

          key !==

            "id_notification" ||

          canViewNotificationId

        )

    ).length;



  /* ============================================================

     RENDER

     ============================================================ */



  return (

    <>

      <div className="row">

        <div className="col-md-6 col-sm-12">

          <h4>

            <span>

              <svg

                xmlns="http://www.w3.org/2000/svg"

                width="20"

                height="20"

                viewBox="0 0 24 24"

                fill="none"

                stroke="currentColor"

                strokeWidth="2"

                strokeLinecap="round"

                strokeLinejoin="round"

              >

                <path

                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"

                />



                <path

                  d="M13.73 21a2 2 0 0 1-3.46 0"

                />

              </svg>

            </span>{" "}



            {translate(

              "Notifications"

            )}{" "}



            ({total})

          </h4>

        </div>

      </div>



      <div className="row">

        <div

          className="col-md-4"

          style={{

            margin:

              "0px 0px 10px 0px",



            padding:

              "10px",

          }}

        >

          <div className="input-group">

            <Dropdown>

              <Dropdown.Toggle

                variant="link"

                id="notification-search-type"

                className="search-type-toggle"

                aria-label={`${translate(

                  "Search by"

                )} ${typeSearch}`}

                title={

                  typeSearch

                }

              >

                <i

                  className="fas fa-chevron-down search-type-chevron"

                />

              </Dropdown.Toggle>



              <Dropdown.Menu>

                {notificationSearchOptions.map(

                  (

                    option

                  ) => (

                    <Dropdown.Item

                      key={

                        option.type

                      }

                      active={

                        type ===

                        option.type

                      }

                      onClick={() =>

                        handleTypeSearch(

                          option.type

                        )

                      }

                    >

                      {

                        option.label

                      }

                    </Dropdown.Item>

                  )

                )}

              </Dropdown.Menu>

            </Dropdown>



            <input

              type="text"

              placeholder={`${translate(

                "Search by"

              )} ${typeSearch}`}

              onChange={

                handleAdvancedSearch

              }

              value={

                search

              }

              className="form-control"

            />

          </div>

        </div>



        <div

          className="col-md-8 d-flex justify-content-end align-items-center"

        >

          <div

            className="dataTables_length"

            id="DataTables_Table_0_length"

          >

            <label

              style={{

                marginBottom:

                  "0",

              }}

            >

              {translate(

                "Show"

              )}



              <select

                name="DataTables_Table_0_length"

                aria-controls="DataTables_Table_0"

                className="custom-select custom-select-sm form-control form-control-sm ml-2"

                style={{

                  width:

                    "66px",

                }}

                onChange={

                  handleSelectChange

                }

                value={

                  limit

                }

              >

                {[

                  10,

                  20,

                  50,

                  100,

                  200,

                  500,

                ].map(

                  (

                    size

                  ) => (

                    <option

                      key={

                        size

                      }

                      value={

                        size

                      }

                    >

                      {size}

                    </option>

                  )

                )}

              </select>

            </label>

          </div>



          <Dropdown>

            <Dropdown.Toggle

              variant=""

              id="notification-columns-dropdown"

              title={translate(

                "Colonnes d'affichage"

              )}

            >

              <i

                className="las la-eye"

              />

            </Dropdown.Toggle>



            <Dropdown.Menu>

              {canViewNotificationId && (

                <ColumnToggle

                  checked={

                    selectedColumns

                      .id_notification

                  }

                  label={translate(

                    "Notification ID"

                  )}

                  onChange={() =>

                    handleColumnChange(

                      "id_notification"

                    )

                  }

                />

              )}



              <ColumnToggle

                checked={

                  selectedColumns

                    .name_groupe_alarme

                }

                label={translate(

                  "Groupe"

                )}

                onChange={() =>

                  handleColumnChange(

                    "name_groupe_alarme"

                  )

                }

              />



              <ColumnToggle

                checked={

                  selectedColumns

                    .name_alarme

                }

                label={translate(

                  "Alarmes"

                )}

                onChange={() =>

                  handleColumnChange(

                    "name_alarme"

                  )

                }

              />



              <ColumnToggle

                checked={

                  selectedColumns

                    .message

                }

                label={translate(

                  "Détails"

                )}

                onChange={() =>

                  handleColumnChange(

                    "message"

                  )

                }

              />



              <ColumnToggle

                checked={

                  selectedColumns

                    .attached

                }

                label={translate(

                  "Attaché à"

                )}

                onChange={() =>

                  handleColumnChange(

                    "attached"

                  )

                }

              />



              <ColumnToggle

                checked={

                  selectedColumns

                    .timestamp

                }

                label={translate(

                  "Date création"

                )}

                onChange={() =>

                  handleColumnChange(

                    "timestamp"

                  )

                }

              />



              <ColumnToggle

                checked={

                  selectedColumns

                    .date_modification

                }

                label={translate(

                  "Date fin"

                )}

                onChange={() =>

                  handleColumnChange(

                    "date_modification"

                  )

                }

              />



              <ColumnToggle

                checked={

                  selectedColumns

                    .infos

                }

                label={translate(

                  "Infos"

                )}

                onChange={() =>

                  handleColumnChange(

                    "infos"

                  )

                }

              />

            </Dropdown.Menu>

          </Dropdown>



          <button

            type="button"

            className="btn btn-outline-secondary btn-sm ml-2"

            onClick={

              handleResetPreferences

            }

            disabled={

              notificationPreferencesSaving

            }

            title={translate(

              "Reset preferences"

            )}

          >

            <i

              className="ri-refresh-line mr-1"

            />



            {translate(

              "Reset"

            )}

          </button>

        </div>

      </div>



      {apiError && (

        <div

          className="alert alert-danger"

        >

          {apiError}

        </div>

      )}



      <div

        className="row m-1 table-responsive"

      >

        <Table

          className="dataTable"

        >

          <thead

            className="bg-white text-uppercase"

          >

            <tr

              className="ligth ligth-data"

            >

              <th>

                <div

                  className="form-check form-check-inline"

                >

                  <input

                    className="form-check-input"

                    type="checkbox"

                  />



                  <label

                    className="form-check-label"

                  />

                </div>

              </th>



              {selectedColumns

                .id_notification &&

                canViewNotificationId && (

                  <SortableHeader

                    label={translate(

                      "Notification ID"

                    )}

                    column="id_notification"

                    currentColumn={

                      colum

                    }

                    direction={

                      sort

                    }

                    onSort={

                      handleSortingColum

                    }

                  />

                )}



              {selectedColumns

                .name_groupe_alarme && (

                <th>

                  {translate(

                    "Groupe"

                  )}

                </th>

              )}



              {selectedColumns

                .name_alarme && (

                <th>

                  {translate(

                    "Alarmes"

                  )}

                </th>

              )}



              {selectedColumns

                .message && (

                <SortableHeader

                  label={translate(

                    "Détails"

                  )}

                  column="message"

                  currentColumn={

                    colum

                  }

                  direction={

                    sort

                  }

                  onSort={

                    handleSortingColum

                  }

                  style={{

                    minWidth:

                      "250px",

                  }}

                />

              )}



              {selectedColumns

                .attached && (

                <th>

                  {translate(

                    "Attaché à"

                  )}

                </th>

              )}



              {selectedColumns

                .timestamp && (

                <SortableHeader

                  label={translate(

                    "Date Création"

                  )}

                  column="timestamp"

                  currentColumn={

                    colum

                  }

                  direction={

                    sort

                  }

                  onSort={

                    handleSortingColum

                  }

                />

              )}



              {selectedColumns

                .date_modification && (

                <th>

                  {translate(

                    "Date Fin"

                  )}

                </th>

              )}



              {selectedColumns

                .infos && (

                <th>

                  {translate(

                    "Infos"

                  )}

                </th>

              )}

            </tr>

          </thead>



          <tbody

            className="ligth-body"

          >

            {loading ? (

              <tr>

                <td

                  className="text-center"

                  colSpan={

                    visibleColumnCount

                  }

                >

                  <PropagateLoader

                    color="#123abc"

                    loading={

                      loading

                    }

                    size={

                      20

                    }

                  />

                </td>

              </tr>

            ) : list_Alarms.length >

              0 ? (

              list_Alarms.map(

                (

                  alarme

                ) => {

                  const notificationType =

                    getNotificationType(

                      alarme.id_type

                    );



                  return (

                    <tr

                      key={

                        alarme.id_notification

                      }

                    >

                      <td>

                        <div

                          className="form-check form-check-inline"

                        >

                          <input

                            type="checkbox"

                            className="form-check-input"

                          />

                        </div>

                      </td>



                      {selectedColumns

                        .id_notification &&

                        canViewNotificationId && (

                          <td>

                            {

                              alarme.id_notification

                            }

                          </td>

                        )}



                      {selectedColumns

                        .name_groupe_alarme && (

                        <td>

                          {

                            notificationType

                              .group

                          }

                        </td>

                      )}



                      {selectedColumns

                        .name_alarme && (

                        <td>

                          {

                            notificationType

                              .label

                          }

                        </td>

                      )}



                      {selectedColumns

                        .message && (

                        <td>

                          {generateDescription(

                            alarme

                          )}

                        </td>

                      )}



                      {selectedColumns

                        .attached && (

                        <td>

                          {getAttachedValue(

                            alarme

                          )}

                        </td>

                      )}



                      {selectedColumns

                        .timestamp && (

                        <td>

                          {formatNotificationDate(

                            alarme.timestamp

                          )}

                        </td>

                      )}



                      {selectedColumns

                        .date_modification && (

                        <td>

                          {formatNotificationDate(

                            alarme.date_modification

                          )}

                        </td>

                      )}



                      {selectedColumns

                        .infos && (

                        <td>

                          <div

                            className="d-flex align-items-center list-action"

                          >

                            <button

                              type="button"

                              className="badge badge-primary border-0 mr-2"

                              title={translate(

                                "View details"

                              )}

                              onClick={() =>

                                handleViewNotification(

                                  alarme

                                )

                              }

                              disabled={

                                detailLoading

                              }

                            >

                              <i

                                className="ri-eye-line mr-0"

                                style={{

                                  fontSize:

                                    "1.2em",

                                }}

                              />

                            </button>



                            {alarme.state ===

                              1 && (

                              <button

                                type="button"

                                className="badge badge-info border-0 mr-2"

                                title={translate(

                                  "Mark as read"

                                )}

                                onClick={() =>

                                  handleMarkAsRead(

                                    alarme

                                  )

                                }

                                disabled={

                                  actionLoadingId ===

                                  alarme.id_notification

                                }

                              >

                                <i

                                  className="ri-mail-open-line mr-0"

                                  style={{

                                    fontSize:

                                      "1.2em",

                                  }}

                                />

                              </button>

                            )}



                            <Link

                              to={getNotificationRoute(

                                alarme

                              )}

                              className="badge badge-success mr-2"

                              data-toggle="tooltip"

                              data-placement="top"

                              title={translate(

                                "View alarm"

                              )}

                            >

                              <i

                                className="ri-share-forward-fill mr-0"

                                style={{

                                  fontSize:

                                    "1.2em",

                                }}

                              />

                            </Link>



                            <button

                              type="button"

                              className="badge badge-danger border-0"

                              title={translate(

                                "Delete"

                              )}

                              onClick={() =>

                                handleDeleteNotification(

                                  alarme

                                )

                              }

                              disabled={

                                actionLoadingId ===

                                alarme.id_notification

                              }

                            >

                              <i

                                className="ri-delete-bin-line mr-0"

                                style={{

                                  fontSize:

                                    "1.2em",

                                }}

                              />

                            </button>

                          </div>

                        </td>

                      )}

                    </tr>

                  );

                }

              )

            ) : (

              <tr>

                <td

                  colSpan={

                    visibleColumnCount

                  }

                  className="text-center"

                >

                  {translate(

                    "No notification available"

                  )}

                </td>

              </tr>

            )}

          </tbody>

        </Table>

      </div>



      <div

        className="row"

      >

        <div

          className="col-md-6 d-flex align-items-center"

        >

          <span>

            {translate(

              "Displaying"

            )}{" "}



            {

              list_Alarms.length

            }{" "}



            {translate(

              "out of"

            )}{" "}



            {total}

          </span>

        </div>



        <div

          className="col-md-6"

        >

          <ReactPaginate

            previousLabel={translate(

              "previous"

            )}

            nextLabel={translate(

              "next"

            )}

            breakLabel="..."

            pageCount={

              pageCount

            }

            marginPagesDisplayed={

              2

            }

            pageRangeDisplayed={

              3

            }

            onPageChange={

              handlePageClick

            }

            forcePage={Math.max(

              currentPage -

                1,



              0

            )}

            containerClassName="pagination justify-content-center"

            pageClassName="page-item"

            pageLinkClassName="page-link"

            previousClassName="page-item"

            previousLinkClassName="page-link"

            nextClassName="page-item"

            nextLinkClassName="page-link"

            breakClassName="page-item"

            breakLinkClassName="page-link"

            activeClassName="active"

          />

        </div>

      </div>



      <Modal

        show={Boolean(

          selectedNotification

        )}

        onHide={() =>

          setSelectedNotification(

            null

          )

        }

        centered

        size="lg"

      >

        <Modal.Header

          closeButton

        >

          <Modal.Title>

            {translate(

              "Notification details"

            )}

          </Modal.Title>

        </Modal.Header>



        <Modal.Body>

          {selectedNotification ? (

            <div>

              <p>

                <strong>

                  {translate(

                    "Notification ID"

                  )}

                  :

                </strong>{" "}



                {selectedNotification

                  .id_notification ??

                  "-"}

              </p>



              <p>

                <strong>

                  {translate(

                    "Groupe"

                  )}

                  :

                </strong>{" "}



                {

                  getNotificationType(

                    selectedNotification

                      .id_type

                  ).group

                }

              </p>



              <p>

                <strong>

                  {translate(

                    "Alarmes"

                  )}

                  :

                </strong>{" "}



                {

                  getNotificationType(

                    selectedNotification

                      .id_type

                  ).label

                }

              </p>



              <p>

                <strong>

                  {translate(

                    "Détails"

                  )}

                  :

                </strong>{" "}



                {getNotificationType(

                  selectedNotification

                    .id_type

                ).label}

              </p>



              <p>

                <strong>

                  {translate(

                    "Attaché à"

                  )}

                  :

                </strong>{" "}



                {getAttachedValue(

                  selectedNotification

                )}

              </p>



              <p>

                <strong>

                  {translate(

                    "Date Création"

                  )}

                  :

                </strong>{" "}



                {formatNotificationDate(

                  selectedNotification

                    .timestamp

                )}

              </p>



              <p>

                <strong>

                  {translate(

                    "Date Fin"

                  )}

                  :

                </strong>{" "}



                {formatNotificationDate(

                  selectedNotification

                    .date_modification

                )}

              </p>



              <p>

                <strong>

                  {translate(

                    "State"

                  )}

                  :

                </strong>{" "}



                {Number(

                  selectedNotification

                    .state

                ) === 0

                  ? translate(

                      "Read"

                    )

                  : translate(

                      "Unread"

                    )}

              </p>

            </div>

          ) : null}

        </Modal.Body>



        <Modal.Footer>

          <Button

            variant="secondary"

            onClick={() =>

              setSelectedNotification(

                null

              )

            }

          >

            {translate(

              "Close"

            )}

          </Button>

        </Modal.Footer>

      </Modal>

    </>

  );

}



/* ============================================================

   CHECKBOX COLONNE

   ============================================================ */



function ColumnToggle({

  checked,

  label,

  onChange,

}: {

  checked:

    boolean;



  label:

    string;



  onChange:

    () => void;

}) {

  return (

    <Dropdown.Item

      as="button"

      onClick={(

        event

      ) =>

        event.stopPropagation()

      }

      style={{

        display:

          "flex",



        alignItems:

          "center",

      }}

    >

      <input

        type="checkbox"

        className="form-check-input"

        checked={

          checked

        }

        onChange={

          onChange

        }

      />



      <span

        style={{

          marginLeft:

            "10px",

        }}

      >

        {label}

      </span>

    </Dropdown.Item>

  );

}



/* ============================================================

   HEADER TRI

   ============================================================ */



function SortableHeader({

  label,

  column,

  currentColumn,

  direction,

  onSort,

  style,

}: {

  label:

    string;



  column:

    string;



  currentColumn:

    string;



  direction:

    string;



  onSort:

    (

      column:

        string

    ) => void;



  style?:

    React.CSSProperties;

}) {

  return (

    <th

      className="sorting"

      onClick={() =>

        onSort(

          column

        )

      }

      style={{

        cursor:

          "pointer",



        ...style,

      }}

    >

      {label}



      {currentColumn ===

      column

        ? ` ${

            direction ===

            "ASC"

              ? "▲"

              : "▼"

          }`

        : ""}

    </th>

  );

}