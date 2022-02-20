import { motion } from "framer-motion";
function ReloadIcon({ style, animate, initial, exit, fill }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      style={style}
      initial={initial}
      animate={animate}
      exit={exit}
    >
      <title>Reload</title>
      <motion.path
        d="M400 148l-21.12-24.57A191.43 191.43 0 00240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 00181.07-128"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <motion.path
        fill={fill}
        d="M464 97.42V208a16 16 0 01-16 16H337.42c-14.26 0-21.4-17.23-11.32-27.31L436.69 86.1C446.77 76 464 83.16 464 97.42z"
      />
    </motion.svg>
  );
}

export default ReloadIcon;
