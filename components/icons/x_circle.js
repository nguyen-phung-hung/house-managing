import { motion } from "framer-motion";
function NoGoodIcon({ style, animate }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon"
      viewBox="0 0 512 512"
      style={style}
      animate={animate}
    >
      <title>Close Circle</title>
      <path
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
        fill="none"
        stroke="currentColor"
        stroke-miterlimit="10"
        stroke-width="32"
      />
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M320 320L192 192M192 320l128-128"
      />
    </motion.svg>
  );
}

export default NoGoodIcon;
