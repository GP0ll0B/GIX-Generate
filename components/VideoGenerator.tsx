import React, { useState, useCallback } from 'react';
import { GeneratedContent } from '../types';
import { generateContent } from '../services/geminiService';
import { VIDEO_PROMPT_ENHANCER_SYSTEM_INSTRUCTION } from '../prompts';
import { Button } from './ui/Button';
import { Loader } from './ui/Loader';
import { WandIcon, VideoCameraIcon, ErrorIcon } from './ui/icons';
import { FacebookGeneratedVideoPost } from './FacebookGeneratedVideoPost';

interface VideoGeneratorProps {
  topic: string;
  setTopic: (topic: string) => void;
  inputImage: { data: string; type: string; } | null;
  setInputImage: (image: { data: string; type: string; } | null) => void;
  isUploadingImage: boolean;
  setIsUploadingImage: (loading: boolean) => void;
  onGenerate: () => void;
  isLoading: boolean;
  currentPost: Extract<GeneratedContent, { type: 'video_generation' }> | null;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  topic, setTopic, inputImage, setInputImage, isUploadingImage, setIsUploadingImage,
  onGenerate, isLoading, currentPost, showToast
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const handleEnhancePrompt = useCallback(async () => {
    if (!topic.trim()) {
      showToast('Please enter a prompt to enhance.', 'error');
      return;
    }
    setIsEnhancing(true);
    try {
      const response = await generateContent({
        model: 'gemini-2.5-flash',
        contents: topic,
        config: {
          systemInstruction: VIDEO_PROMPT_ENHANCER_SYSTEM_INSTRUCTION,
        }
      });
      const enhancedPrompt = response.text.trim();
      setTopic(enhancedPrompt);
      showToast('Prompt enhanced successfully!', 'success');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to enhance prompt.';
      showToast(message, 'error');
    } finally {
      setIsEnhancing(false);
    }
  }, [topic, setTopic, showToast]);
  
  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files[0]) {
        const file = files[0];
        if (!file.type.startsWith('image/')) {
            showToast('Invalid file type. Please select an image.', 'error');
            return;
        }
        setIsUploadingImage(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            setInputImage({
                data: e.target?.result as string,
                type: file.type,
            });
            setIsUploadingImage(false);
        };
        reader.onerror = () => {
            showToast('Failed to read the image file.', 'error');
            setIsUploadingImage(false);
        }
        reader.readAsDataURL(file);
    }
  }, [setInputImage, setIsUploadingImage, showToast]);
  
  const status = currentPost?.status;
  const progress = currentPost?.progress ?? 0;
  const pollingMessage = currentPost?.pollingMessage;
  const videoUrl = currentPost?.videoUrl;

  const renderContent = () => {
    if (isLoading || (status && status !== 'prompt_ready' && status !== 'success' && status !== 'error')) {
      return (
        <div className="text-center p-8 w-full">
          <Loader text={pollingMessage || 'Starting video generation...'} />
          {progress > 0 && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-4">(This process can take several minutes)</p>
        </div>
      );
    } else if (status === 'success' && videoUrl && currentPost) {
      return <FacebookGeneratedVideoPost post={currentPost} />;
    } else if (status === 'error') {
      return (
        <div className="text-center p-8 text-red-500">
          <ErrorIcon className="h-12 w-12 mx-auto" />
          <p className="font-bold mt-4">Generation Failed</p>
          <p className="text-sm mt-1 max-w-md">{pollingMessage}</p>
        </div>
      );
    } else {
      return (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          <VideoCameraIcon className="h-16 w-16 mx-auto" />
          <p className="mt-4 font-semibold">Your generated video will appear here.</p>
          <p className="text-sm">Describe the scene you want to create.</p>
        </div>
      );
    }
  };

  const isGeneratorBusy = isLoading || isEnhancing || isUploadingImage;

  return (
    <div className="h-full flex flex-col space-y-6">
      <h2 className="text-2xl font-bold text-center">AI Video Generator</h2>
      
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-4">
          <div className="relative flex-grow flex flex-col">
            <label htmlFor="video-prompt" className="font-semibold mb-1 text-gray-800 dark:text-gray-200">Prompt</label>
            <textarea
              id="video-prompt"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., A high-speed drone flight through a futuristic city"
              className="w-full flex-grow p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              rows={8}
              disabled={isGeneratorBusy}
            />
            <Button
              onClick={handleEnhancePrompt}
              disabled={isGeneratorBusy || !topic.trim()}
              variant="secondary"
              className="absolute bottom-3 right-3 !py-1.5 !px-3 text-xs"
            >
              {isEnhancing ? <Loader text="" /> : <WandIcon className="h-4 w-4" />} Enhance Prompt
            </Button>
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-gray-800 dark:text-gray-200">Input Image (Optional)</label>
            <p className="text-xs text-gray-500 dark:text-gray-400">Add an image to guide the video generation process.</p>
            {inputImage ? (
                <div className="relative group">
                    <img src={inputImage.data} alt="Video input preview" className="w-full h-auto max-h-48 object-cover rounded-lg" />
                    <button
                        onClick={() => setInputImage(null)}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Remove image"
                        disabled={isGeneratorBusy}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ) : (
                <div 
                    className={`relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors ${isGeneratorBusy ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); if (!isGeneratorBusy) handleFileChange(e.dataTransfer.files); }}
                >
                    <input
                        type="file"
                        id="video-image-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleFileChange(e.target.files)}
                        accept="image/png, image/jpeg, image/webp"
                        disabled={isGeneratorBusy}
                    />
                    {isUploadingImage ? <Loader text="Uploading..." /> : <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to upload</p>}
                </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex-grow aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            {renderContent()}
          </div>
        </div>
      </div>
      
      <div className="flex-shrink-0 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
         <Button
           onClick={onGenerate}
           disabled={isGeneratorBusy || !topic.trim()}
           className="w-full text-lg"
         >
           {isLoading ? <Loader text="Generating Video..." /> : <><VideoCameraIcon className="h-6 w-6"/> Generate Video</>}
         </Button>
      </div>
    </div>
  );
};

export default VideoGenerator;