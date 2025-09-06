import React, { useCallback } from 'react';
import { PostType, TaskType } from '../../types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Loader } from '../ui/Loader';
import { Tabs } from '../ui/Tabs';
import { MegaphoneIcon, UsersIcon, LightBulbIcon, QuestionMarkCircleIcon } from '../ui/icons';

interface TopicFormProps {
    topic: string;
    setTopic: (topic: string) => void;
    postType: Extract<PostType, 'text' | 'grounded_text' | 'image' | 'video' | 'video_generation' | 'blog' | 'seo_blog_post' | 'post_engagement_strategist'>;
    inputImage: { data: string; type: string; } | null;
    setInputImage: (image: { data: string; type: string; } | null) => void;
    isUploadingImage: boolean;
    setIsUploadingImage: (loading: boolean) => void;
    autoLinkKeywords?: boolean;
    setAutoLinkKeywords?: (enabled: boolean) => void;
    task?: TaskType;
    setTask?: (task: TaskType) => void;
}

export const TopicForm: React.FC<TopicFormProps> = ({ 
    topic, setTopic, postType, inputImage, setInputImage, isUploadingImage, setIsUploadingImage, autoLinkKeywords, setAutoLinkKeywords, task, setTask
}) => {
    
    const isVQA = postType === 'text' && task === 'Visual Q&A';

    const placeholderText: Record<string, string> = {
        text: "e.g., The future of decentralized AI (you can also upload an image below)",
        grounded_text: "e.g., Who won the 2024 Nobel Prize in Physics?",
        image: "e.g., A post about the beauty of bioluminescent fungi",
        video: "e.g., A motivational message for aspiring developers",
        video_generation: "e.g., A high-speed drone flight through a futuristic city",
        blog: "e.g., An 800-word article on the future of AI in personalized medicine (you can also upload a header image below)",
        seo_blog_post: "e.g., The impact of quantum computing on modern cryptography",
        post_engagement_strategist: "e.g., An announcement about our new symbiotic AI framework",
    };
    
    const vqaPlaceholder = "e.g., What color is the car in this image?";
    const mainInputLabel = isVQA ? "Ask a question about the image" : "Enter Post Topic or Idea";


    const handleFileChange = useCallback((files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('image/')) {
                console.error("Invalid file type. Please select an image.");
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
                console.error("Failed to read file.");
                setIsUploadingImage(false);
            }
            reader.readAsDataURL(file);
        }
    }, [setInputImage, setIsUploadingImage]);
    
    const showImageUpload = ['text', 'blog', 'video_generation'].includes(postType);
    const imageUploadLabel = postType === 'video_generation' ? 'Input Image (Optional)' : 'Upload Image (Optional)';
    const imageUploadDescription = postType === 'video_generation' ? 'Add an image to guide the video generation process.' : 'Add an image to your post. This will replace the AI image generation option for blog posts.';

    return (
        <div className="space-y-4">
             {postType === 'text' && task && setTask && (
                <div>
                    <label className="font-semibold text-gray-800 dark:text-gray-200 block mb-2">Task</label>
                    <Tabs
                        options={[
                            { value: 'Social Media', label: 'Social Media', icon: <MegaphoneIcon className="h-4 w-4"/> },
                            { value: 'Accessibility', label: 'Accessibility', icon: <UsersIcon className="h-4 w-4"/> },
                            { value: 'Marketing', label: 'Marketing', icon: <LightBulbIcon className="h-4 w-4"/> },
                            { value: 'Visual Q&A', label: 'Visual Q&A', icon: <QuestionMarkCircleIcon className="h-4 w-4"/> }
                        ]}
                        active={task}
                        onSelect={(val) => setTask(val as TaskType)}
                    />
                </div>
            )}

            <div>
                <label htmlFor="topic" className="font-semibold text-gray-800 dark:text-gray-200">
                    {mainInputLabel}
                </label>
                <textarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={isVQA ? vqaPlaceholder : placeholderText[postType]}
                    className="w-full mt-1 p-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all disabled:opacity-50"
                    rows={4}
                    disabled={isUploadingImage}
                />
            </div>
            
            {isUploadingImage && (
                <div className="mt-2 text-sm text-blue-600 dark:text-blue-400 flex items-center">
                    <Loader text="Processing image..." />
                </div>
            )}

            {(postType === 'blog' || postType === 'seo_blog_post') && autoLinkKeywords !== undefined && setAutoLinkKeywords && (
                 <div className="pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                    <ToggleSwitch
                        label="Auto-link Keywords"
                        enabled={autoLinkKeywords}
                        onChange={setAutoLinkKeywords}
                        description="Automatically turn key terms into Google Search links."
                    />
                </div>
            )}
            
            {showImageUpload && (
                <div className="space-y-2 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                    <label className="font-semibold text-gray-800 dark:text-gray-200">
                        {imageUploadLabel}
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{imageUploadDescription}</p>
                    {isVQA && !inputImage && <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">Please upload an image to use Visual Q&A.</p>}
                    {inputImage ? (
                        <div className="relative group">
                            <img src={inputImage.data} alt="Input preview" className="w-full h-auto max-h-48 object-cover rounded-lg" />
                            <button
                                onClick={() => setInputImage(null)}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Remove image"
                                disabled={isUploadingImage}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    ) : (
                        <div 
                            className={`relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors ${isUploadingImage ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (!isUploadingImage) handleFileChange(e.dataTransfer.files);
                            }}
                        >
                            <input
                                type="file"
                                id="image-upload"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(e.target.files)}
                                accept="image/png, image/jpeg, image/webp"
                                disabled={isUploadingImage}
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop an image or click to upload</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};