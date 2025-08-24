import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublishModalProps } from '../../constants';
import { MAKE_WEBHOOK_URL } from "../../constants";
import { useFacebook } from "../../hooks/useFacebook";
import { constructMakePayload, sendToMakeWebhook } from "../../services/makeService";
import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { FacebookIcon, MakeIcon, SendIcon, XIcon } from "../ui/icons";
import { Tabs } from "../ui/Tabs";
import { ManualTokenInfo } from "../ManualTokenInfo";
import { PublishingControls } from "../PublishingControls";

// ------------------------------------------------------------
// Utilities: timezone-safe date handling (default Asia/Dhaka)
// ------------------------------------------------------------
const DEFAULT_TZ = "Asia/Dhaka";

function getTodayLocalISODate(tz: string = DEFAULT_TZ) {
  // Compute local-tz midnight ISO YYYY-MM-DD without time
  const now = new Date();
  // shift to local midnight by constructing a date string
  const tzDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now); // yyyy-mm-dd
  return tzDate;
}

function combineLocalDateTimeToJSDate(dateStr: string, timeStr: string, tz: string = DEFAULT_TZ) {
  // Build an ISO-like string using the provided local TZ, then convert to JS Date (UTC-based)
  // yyyy-mm-ddTHH:mm → interpret as time in tz; convert to UTC Date
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(`${dateStr}T${timeStr}:00`));
  // Fallback: just return naive JS Date if formatter unsupported
  const y = parts.find(p => p.type === "year")?.value ?? dateStr.slice(0,4);
  const m = parts.find(p => p.type === "month")?.value ?? dateStr.slice(5,7);
  const d = parts.find(p => p.type === "day")?.value ?? dateStr.slice(8,10);
  const h = parts.find(p => p.type === "hour")?.value ?? timeStr.slice(0,2);
  const min = parts.find(p => p.type === "minute")?.value ?? timeStr.slice(3,5);
  // Create a Date by pretending the string is in tz, then adjusting by tz offset at that wall time.
  const local = new Date(`${y}-${m}-${d}T${h}:${min}:00`);
  // Compute offset between tz time and UTC at that moment
  const tzOffsetMin = getTimezoneOffsetMinutes(tz, local);
  return new Date(local.getTime() - tzOffsetMin * 60 * 1000);
}

function getTimezoneOffsetMinutes(timeZone: string, at: Date) {
  // Offset in minutes for given tz at the provided instant
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(at);
  const map: Record<string,string> = Object.fromEntries(parts.map(p => [p.type, p.value]));
  // Build a timestamp as if in UTC using the parts, then compare
  const ts = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );
  return -(ts - at.getTime()) / 60000; // minutes
}

// framer-motion presets
const modalAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" as const },
};

const scheduleAnimation = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
};

const targetAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------
const ModalContent: React.FC<PublishModalProps & { timeZone?: string }> = ({
  isOpen,
  onClose,
  generatedContent,
  showToast,
  timeZone = DEFAULT_TZ,
}) => {
  // focus trap (minimal)
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    rootRef.current?.focus();
    return () => { prev?.focus() };
  }, [isOpen]);

  const [publishTarget, setPublishTarget] = useState<"make" | "facebook">("make");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [makePublishStatus, setMakePublishStatus] = useState<"idle" | "publishing" | "success" | "error">("idle");
  const [fbPublishStatus, setFbPublishStatus] = useState<"idle" | "publishing" | "success" | "error">("idle");

  const fb = useFacebook();
  const isHttpsError = Boolean(fb.loginError && fb.loginError.includes("HTTPS"));

  const [manualToken, setManualToken] = useState("");
  const [manualPageId, setManualPageId] = useState("");

  const minDate = useMemo(() => getTodayLocalISODate(timeZone), [timeZone]);
  const schedulingInvalid = isScheduling && (!scheduleDate || !scheduleTime);

  const handleManualConnect = () => fb.connectWithManualToken(manualToken, manualPageId);

  const finalizeDate = useCallback(() => {
    if (!(isScheduling && scheduleDate && scheduleTime)) return null;
    return combineLocalDateTimeToJSDate(scheduleDate, scheduleTime, timeZone);
  }, [isScheduling, scheduleDate, scheduleTime, timeZone]);

  const handleMakePublish = useCallback(async () => {
    if (!generatedContent) return;
    setMakePublishStatus("publishing");
    try {
      const dt = finalizeDate();
      const payload = constructMakePayload(generatedContent, dt);
      await sendToMakeWebhook(MAKE_WEBHOOK_URL, payload);
      setMakePublishStatus("success");
      showToast(dt ? "Post scheduled successfully via Make.com!" : "Post sent to Make.com successfully!", "success");
      setTimeout(() => {
        setMakePublishStatus("idle");
        onClose();
      }, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An unknown error occurred.";
      setMakePublishStatus("error");
      showToast(msg, "error");
      setTimeout(() => setMakePublishStatus("idle"), 2000);
    }
  }, [generatedContent, finalizeDate, showToast, onClose]);

  const handleFacebookPublish = useCallback(async () => {
    if (!generatedContent || !fb.selectedPage) return;
    setFbPublishStatus("publishing");
    try {
      const dt = finalizeDate();
      await fb.handlePublishToFacebook(generatedContent, dt);
      setFbPublishStatus("success");
      showToast(
        dt ? `Post scheduled successfully to ${fb.selectedPage.name}!` : `Post published successfully to ${fb.selectedPage.name}!`,
        "success"
      );
      setTimeout(() => {
        setFbPublishStatus("idle");
        onClose();
      }, 1200);
    } catch (e) {
      setFbPublishStatus("error");
      setTimeout(() => setFbPublishStatus("idle"), 2000);
    }
  }, [generatedContent, fb, finalizeDate, onClose, showToast]);

  const getMakeButtonText = () => {
    if (makePublishStatus === "publishing") return isScheduling ? "Scheduling..." : "Publishing...";
    if (makePublishStatus === "success") return "Success!";
    if (makePublishStatus === "error") return "Failed!";
    return isScheduling ? "Schedule Post" : "Publish Now";
  };

  const getFacebookButtonText = () => {
    if (fbPublishStatus === "publishing" || fb.isPublishing) return isScheduling ? "Scheduling..." : "Publishing...";
    if (fbPublishStatus === "success") return "Success!";
    if (fbPublishStatus === "error") return "Failed!";
    return isScheduling ? "Schedule Post" : "Publish to Page";
  };

  const isMakeButtonDisabled = makePublishStatus === "publishing" || schedulingInvalid;
  const isFacebookButtonDisabled = fb.isPublishing || !fb.selectedPage || fbPublishStatus === "publishing" || schedulingInvalid;
  const showFacebookPublish = generatedContent?.type !== "strategy" && generatedContent?.type !== "video_generation" && generatedContent?.type !== "voice_dialog" && generatedContent?.type !== "prototype" && generatedContent?.type !== "seo_blog_post";
  const postType = generatedContent?.type as string | undefined;

  const makeNote = postType === "video"
    ? "Video posts will be published as text scripts."
    : postType === "strategy"
    ? "The full strategy plan (JSON) will be sent to your scenario."
    : postType === "video_generation"
    ? "The video URL will be sent to your Make.com scenario."
    : postType === "voice_dialog"
    ? "The structured dialog will be sent to your Make.com scenario."
    : "Posts will be sent to your Make.com scenario.";

  const facebookNote = !fb.isLoggedIn
    ? "Connect to Facebook or provide an access token."
    : fb.pages.length === 0
    ? "No manageable Facebook Pages found."
    : "Select a Page to publish or schedule your content.";

  return (
    <motion.div
      initial={modalAnimation.initial}
      animate={modalAnimation.animate}
      exit={modalAnimation.exit}
      transition={modalAnimation.transition}
      role="dialog"
      aria-modal="true"
      aria-label="Publish Content"
      className="relative w-full max-w-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 focus:outline-none"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200/60 dark:border-gray-700/60">
        <h2 className="text-xl font-bold">Publish Content</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
        >
          <XIcon />
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-4" ref={rootRef} tabIndex={-1}>
        <Tabs
          options={[
            { value: "make", label: "Publish via Make", icon: <MakeIcon /> },
            { value: "facebook", label: "Publish to Facebook", icon: <FacebookIcon /> },
          ]}
          active={publishTarget}
          onSelect={(val) => setPublishTarget(val as "make" | "facebook")}
        />

        <div className="flex items-center gap-4" role="radiogroup" aria-label="Publish type">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="publish-type"
              checked={!isScheduling}
              onChange={() => setIsScheduling(false)}
              className="form-radio text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-sm">Publish Now</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="publish-type"
              checked={isScheduling}
              onChange={() => setIsScheduling(true)}
              className="form-radio text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-sm">Schedule for Later</span>
          </label>
        </div>

        <AnimatePresence initial={false}>
          {isScheduling && (
            <motion.div
              initial={scheduleAnimation.initial}
              animate={scheduleAnimation.animate}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label htmlFor="schedule-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="schedule-date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  min={minDate}
                  className="w-full p-2 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/60 dark:bg-gray-700/60 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="schedule-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="schedule-time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full p-2 border border-gray-300/60 dark:border-gray-600/60 rounded-lg bg-white/60 dark:bg-gray-700/60 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Timezone: {timeZone}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {publishTarget === "make" ? (
            <motion.div
              key="make"
              initial={targetAnimation.initial}
              animate={targetAnimation.animate}
              exit={targetAnimation.exit}
              className="space-y-3 pt-2"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">{makeNote}</p>
              <Button
                onClick={handleMakePublish}
                disabled={isMakeButtonDisabled}
                className={`w-full transition-all ${
                  makePublishStatus === "success"
                    ? "!bg-green-600 hover:!bg-green-700"
                    : makePublishStatus === "error"
                    ? "!bg-red-600 hover:!bg-red-700"
                    : ""
                }`}
                aria-disabled={isMakeButtonDisabled}
              >
                {makePublishStatus === "publishing" ? <Loader text={getMakeButtonText()} /> : <SendIcon />}
                {getMakeButtonText()}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="facebook"
              initial={targetAnimation.initial}
              animate={targetAnimation.animate}
              exit={targetAnimation.exit}
              className="space-y-3 pt-2"
            >
              {!showFacebookPublish ? (
                generatedContent?.type === "strategy" ? (
                  <p className="text-sm text-center text-yellow-700 dark:text-yellow-300 bg-yellow-500/10 p-3 rounded-md">
                    Strategy plans cannot be published directly to Facebook and must be copied.
                  </p>
                ) : generatedContent?.type === "voice_dialog" ? (
                  <p className="text-sm text-center text-yellow-700 dark:text-yellow-300 bg-yellow-500/10 p-3 rounded-md">
                    Voice dialogs cannot be published directly to Facebook.
                  </p>
                ) : (
                  <p className="text-sm text-center text-yellow-700 dark:text-yellow-300 bg-yellow-500/10 p-3 rounded-md">
                    Generated videos must be downloaded and published to Facebook manually.
                  </p>
                )
              ) : (
                <>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">{facebookNote}</p>
                  {!fb.isLoggedIn ? (
                    <div className="space-y-3">
                      {isHttpsError ? (
                        <p className="text-xs text-red-600 dark:text-red-400 text-center p-2 bg-red-500/10 rounded-md">{fb.loginError}</p>
                      ) : (
                        <>
                          <Button onClick={fb.login} disabled={!fb.isSdkLoaded} className="w-full !bg-blue-800 hover:!bg-blue-900">
                            <FacebookIcon /> Connect with Facebook
                          </Button>
                          {fb.loginError && (
                            <p className="text-xs text-red-600 dark:text-red-400 text-center">{fb.loginError}</p>
                          )}
                        </>
                      )}
                      <div className="flex items-center gap-2" aria-hidden>
                        <hr className="flex-grow border-gray-300/60 dark:border-gray-600/60" />
                        <span className="text-xs text-gray-500">OR</span>
                        <hr className="flex-grow border-gray-300/60 dark:border-gray-600/60" />
                      </div>
                      <ManualTokenInfo
                        manualToken={manualToken}
                        setManualToken={setManualToken}
                        manualPageId={manualPageId}
                        setManualPageId={setManualPageId}
                        onConnect={handleManualConnect}
                        isConnecting={fb.isVerifyingToken}
                        error={fb.verificationError}
                      />
                      <p className="text-[11px] text-gray-500 text-center">Never paste long-lived tokens in shared environments.</p>
                    </div>
                  ) : (
                    <PublishingControls
                      onPublish={handleFacebookPublish}
                      isPublishing={fb.isPublishing || fbPublishStatus === "publishing"}
                      buttonText={getFacebookButtonText()}
                      isButtonDisabled={isFacebookButtonDisabled}
                      publishStatus={fbPublishStatus}
                      error={fb.publishError}
                      pages={fb.pages}
                      selectedPage={fb.selectedPage}
                      onSelectPage={fb.setSelectedPage}
                    />
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export const PublishModal: React.FC<PublishModalProps & { timeZone?: string }> = (props) => {
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    props.onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-overlay-show backdrop-blur-md"
      onClick={onOverlayClick}
      aria-hidden={!props.isOpen}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ModalContent {...props} />
      </div>
    </div>
  );
};

export default PublishModal;