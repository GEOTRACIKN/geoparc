import React from "react";
import { Button } from "react-bootstrap";

type Props = {
  translate: (key: string) => string;
  buttonClicked: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function TransportRequestBottomBar({
  translate,
  buttonClicked,
  onCancel,
  onSubmit,
}: Props) {
  return (
    <div className="mobile-bottom-bar">
      <Button variant="light" onClick={onCancel} type="button">
        {translate("Cancel")}
      </Button>

      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={buttonClicked}
        type="button"
      >
        <i className="fas fa-paper-plane mr-2"></i>
        {translate("send")}
      </Button>
    </div>
  );
}