import { motion } from "motion/react";

function ModalBackdrop({ ...props }) {
  return (
    <motion.div
      id="modal-backdrop"
      {...props}
      initial={{
        
        opacity: 0,
      }}
      animate={{
  
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      exit={{
    
        opacity: 0,
      }}
    ></motion.div>
  );
}

export default ModalBackdrop;
