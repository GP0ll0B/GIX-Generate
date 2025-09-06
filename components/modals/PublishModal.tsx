import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublishModalProps } from '../../types';
import { MAKE_WEBHOOK_URL, GIX_BLOG_URL } from "../../constants";
import { useFacebook } from "../../hooks/useFacebook";
import { constructMakePayload, sendToMakeWebhook } from "../../services/makeService";
import { Button } from "../ui/Button";
import { Loader } from "../ui/Loader";
import { FacebookIcon, MakeIcon, SendIcon, XIcon, ExternalLinkIcon, CopyIcon, CheckIcon } from "../ui/icons";
import { Tabs } from "../ui/Tabs";
import { ManualTokenInfo } from "../ManualTokenInfo";
import { PublishingControls } from "../PublishingControls";
import { HttpsErrorExplanation } from "../ui/HttpsErrorExplanation";

const MotionDiv = motion.div as any;

// ------------------------------------------------------------
// Utilities
// ------------------------------------------------------------
const DEFAULT_TZ = "Asia/Dhaka";

function getTodayLocalISODate(tz: string = DEFAULT_TZ) {
  const now = new Date();
  const tzDate = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return tzDate;
}

function combineLocalDateTimeToJSDate(dateStr: string, timeStr: string, tz: string = DEFAULT_TZ): Date {
  const tempDate = new Date(`${dateStr}T${timeStr}:00`);
  const targetOffsetMinutes = getTimezoneOffsetMinutes(tz, tempDate);
  const offset = -targetOffsetMinutes;
  const sign = offset >= 0 ? '+' : '-';
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const offsetMins = String(Math.abs(offset) % 60).padStart(2, '0');
  const offsetString = `${sign}${offsetHours}:${offsetMins}`;
  const isoString = `${dateStr}T${timeStr}:00${offsetString}`;
  return new Date(isoString);
}

function getTimezoneOffsetMinutes(timeZone: string, at: Date) {
  const dtf = new Intl.DateTimeFormat("en-US", { timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const parts = dtf.formatToParts(at);
  const map: Record<string,string> = Object.fromEntries(parts.map(p => [p.type, p.value]));
  const ts = Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day), Number(map.hour), Number(map.minute), Number(map.second));
  return -(ts - at.getTime()) / 60000;
}

const convertMarkdownToHtmlString = (markdown: string): string => {
    let html = '';
    const lines = markdown.split('\n');
    let inList = false;

    const flushList = () => {
        if (inList) {
            html += '</ul>\n';
            inList = false;
        }
    };

    lines.forEach(line => {
        let processedLine = line.trim();
        if (processedLine.startsWith('#### ')) {
            flushList();
            html += `<h4>${processedLine.substring(5)}</h4>\n`;
        } else if (processedLine.startsWith('### ')) {
            flushList();
            html += `<h3>${processedLine.substring(4)}</h3>\n`;
        } else if (processedLine.startsWith('## ')) {
            flushList();
            html += `<h2>${processedLine.substring(3)}</h2>\n`;
        } else if (processedLine.startsWith('# ')) {
            flushList();
            html += `<h1>${processedLine.substring(2)}</h1>\n`;
        } else if (processedLine.startsWith('* ')) {
            if (!inList) {
                html += '<ul>\n';
                inList = true;
            }
            html += `  <li>${processedLine.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>\n`;
        } else if (processedLine === '---' || processedLine === '***') {
            flushList();
            html += '<hr />\n';
        } else if (processedLine) {
            flushList();
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            html += `<p>${processedLine}</p>\n`;
        }
    });
    flushList();
    return html;
};


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
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Focus Trapping for Accessibility
  useEffect(() => {
    if (!isOpen || !rootRef.current) return;

    const focusableElements = rootRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) { // Shift+Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    const prevActiveElement = document.activeElement as HTMLElement;
    firstElement?.focus();

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        prevActiveElement?.focus();
    };
}, [isOpen]);

  const [publishTarget, setPublishTarget] = useState<"make" | "facebook">("make");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isBlogHtmlCopied, setIsBlogHtmlCopied] = useState(false);

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
      const message = e instanceof Error ? e.message : "An unknown error occurred during publishing.";
      showToast(message, 'error');
      setTimeout(() => setFbPublishStatus("idle"), 2000);
    }
  }, [generatedContent, fb, finalizeDate, onClose, showToast]);

  const handleCopyBlogHtml = useCallback(() => {
        if (!generatedContent || (generatedContent.type !== 'blog' && (generatedContent.type !== 'seo_blog_post' || generatedContent.stage !== 'article'))) return;

        const title = generatedContent.type === 'blog' ? generatedContent.title : generatedContent.selectedTitle || 'Untitled Post';
        const body = generatedContent.body || '';

        const htmlBody = convertMarkdownToHtmlString(body);

        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: sans-serif; line-height: 1.6; max-width: 800px; margin: 2rem auto; padding: 1rem; }
        h1, h2, h3, h4 { line-height: 1.2; }
    </style>
</head>
<body>
    <h1>${title}</h1>
    ${htmlBody}
</body>
</html>`;
        navigator.clipboard.writeText(fullHtml);
        setIsBlogHtmlCopied(true);
        showToast('Full blog post HTML copied!', 'success');
        setTimeout(() => setIsBlogHtmlCopied(false), 2000);
    }, [generatedContent, showToast]);

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
  
  const postType = generatedContent?.type;
  const isBlogPost = postType === 'blog' || (postType === 'seo_blog_post' && generatedContent.stage === 'article');

  const makeNote = postType === "video"
    ? "Video posts will be published as text scripts."
    : postType === "strategy"
    ? "The full strategy plan (JSON) will be sent to your scenario."
    : postType === "video_generation"
    ? "The generated video URL will be sent to your Make.com scenario."
    : postType === "voice_dialog"
    ? "The structured dialog will be sent to your Make.com scenario."
    : "Posts will be sent to your Make.com scenario.";

  const facebookNote = !fb.isLoggedIn
    ? "Connect to Facebook or provide an access token."
    : fb.pages.length === 0
    ? "No manageable Facebook Pages found."
    : isBlogPost 
    ? "Share a preview of your article to drive traffic from Facebook."
    : "Select a Page to publish or schedule your content.";

  const showFacebookPublish = postType !== "strategy" && postType !== "video_generation" && postType !== "voice_dialog" && postType !== "prototype";

  return (
    <MotionDiv
      ref={rootRef}
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

      <div className="p-4 sm:p-6 space-y-4">
        {isBlogPost && (
            <div className="space-y-3 p-4 bg-blue-500/10 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-lg">
                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-300">Blog Publishing Workflow</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300/80">Copy the full HTML and paste it into your blog editor, then share a preview to Facebook to drive traffic.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleCopyBlogHtml} variant="secondary" className="w-full !py-2 !text-sm">
                        {isBlogHtmlCopied ? <><CheckIcon/> Copied</> : <><CopyIcon/> Copy Full HTML for Blog</>}
                    </Button>
                    <a href={GIX_BLOG_URL} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button variant="secondary" className="w-full !py-2 !text-sm">
                            <ExternalLinkIcon className="h-4 w-4"/> Open GIX Blog
                        </Button>
                    </a>
                </div>
            </div>
        )}
        
        <Tabs
          options={[
            { value: "make", label: "Publish via Make", icon: <MakeIcon /> },
            { value: "facebook", label: `Publish to Facebook${isBlogPost ? ' (Preview)' : ''}`, icon: <FacebookIcon /> },
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
            <MotionDiv
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
            </MotionDiv>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {publishTarget === "make" ? (
            <MotionDiv
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
            </MotionDiv>
          ) : (
            <MotionDiv
              key="facebook"
              initial={targetAnimation.initial}
              animate={targetAnimation.animate}
              exit={targetAnimation.exit}
              className="space-y-3 pt-2"
            >
              {!showFacebookPublish ? (
                <p className="text-sm text-center text-yellow-700 dark:text-yellow-300 bg-yellow-500/10 p-3 rounded-md">
                    This content type cannot be directly published to Facebook. Please use the Make.com workflow.
                </p>
              ) : (
                <>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic text-center">{facebookNote}</p>
                  {!fb.isLoggedIn ? (
                    <div className="space-y-3">
                      {isHttpsError ? (
                        <HttpsErrorExplanation />
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
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </MotionDiv>
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
