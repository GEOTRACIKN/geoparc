import React, { useState } from 'react';
import { IconType} from 'react-icons';
import { Navigate } from 'react-router-dom';

interface Buttons {
  text: string;
  icon:React.ReactNode;
  ClasStyle?: string | undefined;
  onClick?: () => void | undefined;
}
/**
 * A custom button component that displays an icon and optional text on hover.
 *
 * @param {Buttons} props - The props for the button component.
 * @param {string} props.text - The text to display on hover.
 * @param {any} props.icon - The icon to display in the button.
 * @param {string} [props.ClasStyle] - An optional CSS class to apply to the button.
 * @returns {JSX.Element} - The rendered button component.
 * @example
  * <Button text={translate("Ajouter un Vehicule")} icon={<FaPlus />} ClasStyle='bg-success' />
 */

export const ButtonCustomHover = ({ text, icon, ClasStyle,onClick }: Buttons) => {
  const [showText, setShowText] = useState(false);

  return (
    <>
      <style>
        {`
          .custom-button {
          display: inline-block;
          padding: 10px;
          border: 1px solid transparent;
          border-radius: 5px;
          margin: 5px;
          position: relative;
          cursor: pointer;
        }

        .custom-button:hover {
          border-color: #333;
        }

        .custom-button span {
          display: none;
          position: absolute;
          top: -30px; /* Place le texte au-dessus de l'icône */
          left: -80%;
          transform: translateX(-50%);
          background-color: #333;
          color: #fff;
          padding: 5px;
          border-radius: 5px;
          white-space: nowrap;
          z-index: 2;
        }

        .custom-button:hover span {
          display: block;
        }

        .my-custom-button {
          background-color: #f0f0f0;
          color: #333;
        }


        @media screen and (max-width: 768px) {
          .custom-button {
            padding: 8px;
            margin: 3px;
          }

          .custom-button span {
            top: -25px;
            padding: 4px;
          }
        }
        }

      `}
      </style>
      <div
        className={`custom-button my-custom-button ${ClasStyle}`}
        onMouseEnter={() => setShowText(true)}
        onMouseLeave={() => setShowText(false)}
        onClick={onClick} 
      >
        <span>{text}</span>
        <i className="ico">{icon}</i>
      </div>
    </>
  );
};
