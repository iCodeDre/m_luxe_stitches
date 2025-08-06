import Image from "next/image";

import deleteIcon from "@/assets/UI/delete-icon.svg";

function DeleteIcon({ ...props }) {
  return (
    <button {...props}>
      <Image src={deleteIcon} alt="delete-icon" fill />
    </button>
  );
}

export default DeleteIcon;
