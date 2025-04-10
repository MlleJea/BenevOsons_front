import React from "react";
import "../css/style.css";

const PopupModal = ({message,onClose}) => {

    return(
        <div className = "modal-overlay">
            <div className="modal-box">
                <button className="modal-close" onClick={onClose}>X</button>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default PopupModal;