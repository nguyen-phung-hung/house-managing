import { useLayout } from "../../store/layout";
import styles from "./navigation.module.css";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import SettingsIcon from "../icons/setting";
import CloseaMailIcon from "../icons/close_mail";
import BellIcon from "../icons/bell";
import { useUser } from "../../store/user";
// import DarkIcon from "../icons/dark_icon";
import AvatarUser from "../icons/avatar";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import SearchIcon from "../icons/search";
import axios from "axios";
import SearchModal from "../search/search-modal";
import useOutside from "../hooks/click-outside";
import { useNotification } from "../hooks/use-notification";
import { useViewportSize } from "@mantine/hooks";
import NotificationsTabs from "./notification/notifications-tab";
import NotificationOffFillIcon from "../icons/notification-off";

const iconsStyle = {
  minWidth: "30px",
  minHeight: "30px",
  maxWidth: "30px",
  maxHeight: "30px",
  marginLeft: "20px",
  marginRight: "20px",
  cursor: "pointer",
};

function PageTitle() {
  const { navClosed, currentPage } = useLayout();
  const { displayName, user } = useUser();
  const router = useRouter();

  const format = /[`!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;

  const [userName, setUserName] = useState(displayName);
  const searchIconAnimate = useAnimation();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [timeoutID, setTimeoutID] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const { backNotifications } = useNotification();
  const [date, setDate] = useState(new Date());
  const [notiModals, setNotiModals] = useState(false);

  const { height, width } = useViewportSize();

  const clickOutsideRef = useRef(null);
  const clickOutNotiModalRef = useRef(null);

  useOutside(clickOutNotiModalRef, setNotiModals);

  useOutside(clickOutsideRef, setSearchModal);

  useEffect(() => {
    setUserName(displayName);
  }, [displayName]);

  useEffect(() => {
    if (searchInput.length <= 2) {
      console.log("searchInput.length <= 2");
      setSearchResult([]);
      setSearchModal(false);
    }
  }, [searchInput]);

  function onClicked(page) {
    router.push(page);
  }

  const filteredNotifications = backNotifications.slice(0, 9);

  async function onSearch(e) {
    clearTimeout(timeoutID);
    let input = e.target.value;
    format.test(e.target.value)
      ? (input = e.target.value.replace(format, ""))
      : null;
    console.log("e.target.value", input <= 2);

    setSearchInput(input);
    if (input.length <= 2) {
      // console.log("this bein called");
      setSearchResult([]);
      setDate(new Date());
      return setSearchModal(false);
    }
    if (input.length > 2) {
      const timeOutID = setTimeout(async () => {
        await axios
          .get(`/api/search-user/${input}`)
          .then((res) => {
            setSearchResult(res.data.data);
            setDate(new Date());
            setSearchModal(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }, 200);
      setTimeoutID(timeOutID);
    }
  }

  async function onSearchAnimation() {
    setIsFocused(true);
    if (searchInput?.length > 2 && searchResult?.length > 0) {
      setSearchModal(true);
    }

    await searchIconAnimate.start({
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    });
    await searchIconAnimate.start({
      rotate: 90,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        delay: 0.2,
      },
    });
    searchIconAnimate.start({
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        delay: 0.2,
      },
    });
  }

  async function onSearchAnimationEnd() {
    setIsFocused(false);
    await searchIconAnimate.start({
      y: -5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    });
    await searchIconAnimate.start({
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        delay: 0.2,
      },
    });
    searchIconAnimate.start({
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
        delay: 0.2,
      },
    });
  }

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(function (position) {
  //     console.log(position);
  //   });
  // }, []);

  return (
    <>
      <AnimatePresence exitBeforeEnter>
        {notiModals && (
          <motion.div
            className={styles.noti_modal}
            ref={clickOutNotiModalRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // style={{ left: `${width * 0.6}px` }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              <div className={styles.notification_text}>Notifications</div>
              <motion.div
                className={styles.noti_modal_backg}
                initial={{ width: "50px", height: "50px" }}
                animate={{
                  width: "3000px",
                  height: "3000px",
                  transition: { duration: 1, ease: "easeInOut" },
                }}
              />
              {filteredNotifications?.length > 0 ? (
                <NotificationsTabs
                  notifications={filteredNotifications}
                  setNotiModals={setNotiModals}
                />
              ) : (
                <div className={styles.noti_modal_noNoti}>
                  <div>
                    <NotificationOffFillIcon style={{ width: "40px" }} />
                  </div>
                  No notification currently
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className={styles.pagetitle}
        initial={
          navClosed
            ? { left: "120px", width: "calc(100vw - 120px)", y: -100 }
            : { left: "300px", width: "calc(100vw - 300px)", y: -100 }
        }
        animate={
          navClosed
            ? { left: "120px", width: "calc(100% - 120px)", y: 0 }
            : { left: "300px", width: "calc(100% - 300px)", y: 0 }
        }
      >
        <AnimatePresence exitBeforeEnter>
          <motion.div
            className={styles.title}
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {currentPage}
          </motion.div>
        </AnimatePresence>
        <motion.div className={styles.search_box} ref={clickOutsideRef}>
          <SearchIcon style={{ width: "25px" }} animate={searchIconAnimate} />
          <motion.input
            placeholder={
              isFocused
                ? "You can search for your friends here"
                : "Type in anything to search"
            }
            className={styles.input}
            onFocus={onSearchAnimation}
            onBlur={onSearchAnimationEnd}
            type="text"
            value={searchInput}
            onChange={onSearch}
          />
          <AnimatePresence exitBeforeEnter>
            {searchModal && (
              <SearchModal
                date={date}
                results={searchResult}
                key={"search-modal"}
                innerRef={clickOutsideRef}
                setSearchModal={setSearchModal}
                isNoResult={searchResult.length === 0}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <div className={styles.user}>
          <div className={styles.notification}>
            <div style={iconsStyle}>
              <CloseaMailIcon />
            </div>

            <div
              style={iconsStyle}
              className={styles.notification_bell}
              onClick={() => {
                setNotiModals(!notiModals);
              }}
            >
              {backNotifications.length > 0 ? (
                <div className={styles.notification_bell_number}>
                  <AnimatePresence exitBeforeEnter>
                    <motion.div
                      initial={{ y: -20 }}
                      animate={{ y: 0 }}
                      exit={{ y: 20 }}
                      transition={{ duration: 0.5 }}
                      key={backNotifications?.length}
                    >
                      {backNotifications?.length < 10
                        ? backNotifications?.length
                        : 9 + "+"}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : null}

              <BellIcon />
            </div>
          </div>

          {/* <DarkIcon /> */}
          <SettingsIcon
            style={iconsStyle}
            onClick={() => {
              onClicked("/dashboard/setting");
            }}
            whileHover={{
              rotate: 180,
              transition: { duration: 1 },
              scale: 1.1,
            }}
            whileTap={{ scale: 0.7 }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <AvatarUser email={user?.email} />
            <span className={styles.userName}>{userName?.userName}</span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default PageTitle;
