import styles from "./custom-menu.module.css";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import CustomMenuLink from "./custom-menu-link";
import { useLayout } from "../../store/layout";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCountUp } from "react-countup";
import { useRef } from "react";
import Link from "next/link";
import { usePreviousRoute } from "../../store/previous-route";

const links = [
  { name: "Plans", url: "/plans" },
  { name: "About us", url: "/about-us" },
  { name: "Support", url: "/support" },
  { name: "Contact", url: "/contact" },
];

function CustomMenuIcon({ style, device }) {
  const lineGap = device === "mobile" ? 8 : 10;
  const router = useRouter();

  const line1 = useAnimation();
  const line2 = useAnimation();
  const line3 = useAnimation();
  const bgHolderAnimation = useAnimation();
  const backgroundAnimation = useAnimation();
  const firstLoadBGAimation = useAnimation();
  const linkAnimation = useAnimation();
  const counterAnimation = useAnimation();
  const initialCounterAnimation = useAnimation();

  const counterLineAnimation = useAnimation();

  const { mobileNavState, setMobileNavState } = useLayout();
  const { previousRoute } = usePreviousRoute();
  const [menuOpen, setMenuOpen] = useState(false);

  const countUpRef = useRef(null);
  const countUpRef2 = useRef(null);

  const {
    start: initalStart,
    reset: initialReset,
    pauseResume: initialPause,
  } = useCountUp({
    ref: countUpRef2,
    start: 0,
    end: 100,
    duration: 1,
  });

  const { start, reset, pauseResume } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: 100,
    duration: 1,
    onEnd: () => {
      setMobileNavState(false);
      counterAnimation.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    },
  });

  async function CloseBackGround() {
    firstLoadBGAimation.start({
      top: "-5000px",
      transition: { duration: 2, ease: "easeInOut" },
    });
    counterLineAnimation.start({
      height: 0,
      transition: { duration: 0 },
    });
    counterLineAnimation.start({
      bottom: 0,
      transition: { duration: 0 },
    });
    initalStart();
    // initialCounterAnimation.start({
    //   opacity: 0,
    //   transition: { duration: 1, ease: "easeInOut" },
    // });
    // initialCounterAnimation.start({
    //   opacity: 1,
    //   color: "#fff",
    //   transition: { duration: 1 },
    // });
    await counterLineAnimation.start({
      height: "100%",
      transition: { duration: 1, ease: "easeInOut" },
    });

    counterLineAnimation.start({
      height: "0%",
      bottom: "100%",
      transition: { duration: 1, ease: "easeInOut" },
    });
  }

  useEffect(() => {
    if (!previousRoute) {
      CloseBackGround();
    }
  }, []);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      if (countUpRef) {
        reset();
        pauseResume();
      }

      counterAnimation.start({
        opacity: 1,
      });
      counterLineAnimation.start({
        bottom: 0,
        transition: { duration: 0 },
      });
      counterLineAnimation.start({
        height: "10%",
        transition: { duration: 0.5, ease: "easeInOut" },
      });
    });
    router.events.on("routeChangeComplete", () => {
      if (countUpRef) {
        pauseResume();
        start();
      }

      counterLineAnimation.start({
        height: "100%",
        transition: { duration: 1, ease: "easeInOut" },
      });
    });

    return () => {
      router.events.off("routeChangeStart");
      router.events.off("routeChangeComplete");
    };
  }, []);

  useEffect(() => {
    async function openMenu() {
      // console.log("mobileNavState", mobileNavState);

      if (mobileNavState) {
        setMenuOpen(true);
        line1.start({
          y: -lineGap,
          rotate: 0,
          transition: { duration: 0 },
        });
        line3.start({
          y: lineGap,
          rotate: 0,
          transition: { duration: 0 },
        });
        await line2.start({ left: "0%", transition: { duration: 0 } });
        await linkAnimation.start({
          left: "-100%",
          transition: { duration: 0 },
        });

        bgHolderAnimation.start({
          display: "contents",
          transition: {
            duration: 0,
          },
        });
        await backgroundAnimation.start({
          top: "5000px",
          transition: { duration: 0 },
        });
        backgroundAnimation.start({
          top: "-1000px",
          transition: { duration: 2 },
        });
        line1.start({ backgroundColor: "#fff", transition: { duration: 2 } });
        line3.start({ backgroundColor: "#fff", transition: { duration: 2 } });

        await line2.start({ left: "100%", transition: { duration: 0.5 } });
        linkAnimation.start({
          left: "0%",
          transition: { duration: 1.5, delay: 0.5, ease: "easeInOut" },
        });

        line1.start({ y: 0, rotate: 45, transition: { duration: 0.5 } });
        line3.start({ y: 0, rotate: 315, transition: { duration: 0.5 } });

        return;
      }

      if (!mobileNavState) {
        setMenuOpen(false);
        linkAnimation.start({
          left: "100%",
          transition: { duration: 1.5, ease: "easeInOut" },
        });
        line1.start({ y: -lineGap, rotate: 0, transition: { duration: 0.5 } });
        line3.start({ y: lineGap, rotate: 0, transition: { duration: 0.5 } });
        line1.start({
          backgroundColor: "#050505",
          transition: { duration: 1.5 },
        });
        line3.start({
          backgroundColor: "#050505",
          transition: { duration: 1.5 },
        });

        counterLineAnimation.start({
          height: 0,
          bottom: "100%",
          transition: { duration: 1, ease: "easeInOut" },
        });
        counterAnimation.start({
          opacity: 0,
        });

        await backgroundAnimation.start({
          top: "-5000px",
          transition: { duration: 1.5 },
        });

        line2.start({ left: "0%", transition: { duration: 0.5 } });
        counterAnimation.start({
          opacity: 0,
        });

        // counterLineAnimation.start({
        //   height: "0px",
        //   transition: { duration: 0 },
        // });

        bgHolderAnimation.start({
          display: "none",
          transition: {
            duration: 0,
          },
        });
      }
    }

    openMenu();
  }, [mobileNavState]);

  return (
    <>
      <motion.div
        className={styles.container}
        style={style}
        onClick={() => {
          setMobileNavState((prevState) => !prevState);
        }}
      >
        <div className={styles.relative_container}>
          <motion.div
            className={styles.line}
            initial={{ y: -lineGap }}
            animate={line1}
          />
          <motion.div className={styles.line} animate={line2} />
          <motion.div
            className={styles.line}
            initial={{ y: lineGap }}
            animate={line3}
          />
        </div>
      </motion.div>

      <motion.div className={styles.mobile_nav} animate={bgHolderAnimation}>
        <div className={styles.fixed_content}>
          <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div className={styles.links_container}>
              <div className={styles.brand_container}>
                <div className={styles.link_holder}>Subsica</div>
                <motion.div
                  className={styles.brand_name}
                  animate={linkAnimation}
                >
                  <Link href={"/"}>Subsica</Link>
                </motion.div>
              </div>

              {links.map((link) => {
                return (
                  <CustomMenuLink
                    link={link}
                    device={device}
                    menuOpen={menuOpen}
                    key={link.name}
                    delay={Math.random() * 1.1 + 1}
                  />
                );
              })}
            </div>
            <motion.div
              className={styles.mobile_nav_bg}
              //   initial={{ scale: 2 }}
              animate={backgroundAnimation}
            />
          </div>
          <motion.div
            ref={countUpRef}
            className={styles.counter}
            animate={counterAnimation}
          />
        </div>
      </motion.div>
      <motion.div
        className={styles.first_load_bg}
        //   initial={{ scale: 2 }}
        animate={firstLoadBGAimation}
      />
      <motion.div className={styles.counter_line_container}>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            // backgroundColor: "red",
          }}
        >
          <motion.div
            className={styles.counter_line}
            animate={counterLineAnimation}
          />
        </div>
      </motion.div>

      <motion.div
        ref={countUpRef2}
        className={styles.counter1}
        animate={initialCounterAnimation}
        // exit={{ opacity: 0 }}
      />
    </>
  );
}

export default CustomMenuIcon;