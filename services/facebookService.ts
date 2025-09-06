import { FacebookPage, PublishPostParams } from "../types";

const isHttps = (): boolean => {
    return window.location.protocol === 'https:';
};

/**
 * Parses nested error objects from the Facebook API to get a specific message based on error codes.
 * @param error The error object caught from a fetch call.
 * @returns An Error object with a user-friendly message.
 */
function handleFbApiError(error: any): Error {
    if (!error || typeof error !== 'object') {
        return new Error('An unknown error occurred during the Facebook API request.');
    }
    const message = error.message || 'An unknown Facebook API error occurred.';
    const code = error.code;

    switch (code) {
        case 10:
        case 200:
        case 210:
        case 283:
            return new Error(`Permission Denied (Code: ${code}): ${message}. Please re-authenticate and ensure all permissions are granted.`);
        case 190:
            return new Error(`Your Facebook session has expired or is invalid. Please log in again to continue. (Code: ${code})`);
        case 100:
            return new Error(`Invalid Parameter: The request sent to Facebook was malformed. Details: ${message} (Code: ${code})`);
        case 4:
        case 17:
        case 341:
            return new Error(`API Limit Reached: You've made too many requests to Facebook. Please wait a while before trying again. (Code: ${code})`);
        case 368:
            return new Error(`Page Role Error: You must be an admin, editor, or moderator of the selected Page to perform this action. (Code: ${code})`);
        case 506:
            return new Error(`Duplicate Content: This exact post has been made recently. Please create unique content to post again. (Code: ${code})`);
        case 803:
            return new Error(`Content Violation: This content was flagged for violating Facebook's policies. Please review and edit your post. (Code: ${code})`);
        default:
            return new Error(message);
    }
}


export const getPageDetails = async (pageId: string, accessToken: string): Promise<{ name: string, picture?: { data: { url: string } } }> => {
    try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}?fields=name,picture&access_token=${accessToken}`);
        const data = await res.json();
        if (data.error) throw handleFbApiError(data.error);
        return data;
    } catch (error: any) {
        console.error('Facebook getPageDetails error:', error);
        throw new Error(error.message || 'Failed to fetch page details.');
    }
};

export const initFacebookSdk = (appId: string | undefined): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!isHttps()) {
            const message = "Facebook features require a secure (HTTPS) connection. To enable Facebook login, please serve the application over HTTPS.";
            console.warn(message);
            return reject(new Error(message));
        }

        if (window.FB && window.FB.AppEvents) {
            resolve();
            return;
        }

        window.fbAsyncInit = function() {
            if (appId) {
                window.FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: 'v21.0'
                });
            } else {
                 console.warn("Facebook App ID is not configured. The Facebook login feature will be unavailable.");
            }
            resolve();
        };

        if (!document.getElementById('facebook-jssdk')) {
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                if(fjs && fjs.parentNode) fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    });
};

export const getLoginStatus = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!window.FB || typeof window.FB.getLoginStatus !== 'function') {
            return reject(new Error('Facebook SDK not initialized or App ID missing.'));
        }
        window.FB.getLoginStatus(function(response: any) {
            if (response.status === 'connected') {
                resolve(response);
            } else {
                reject(new Error(response.status || 'User not connected.'));
            }
        });
    });
};

export const login = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!window.FB || typeof window.FB.login !== 'function') {
            return reject(new Error('Facebook SDK not initialized or App ID missing.'));
        }
        window.FB.login(function(response: any) {
            if (response.authResponse) {
                resolve(response);
            } else {
                reject(new Error('User cancelled login or did not fully authorize.'));
            }
        }, { scope: 'public_profile,pages_show_list,pages_manage_posts,pages_read_engagement,pages_manage_engagement,business_management' });
    });
};

export const logout = (): Promise<any> => {
    return new Promise(resolve => {
        if (!window.FB || typeof window.FB.logout !== 'function') {
            return resolve(null);
        }
        window.FB.logout(function(response: any) {
            resolve(response);
        });
    });
};

export const getUserPages = async (): Promise<FacebookPage[]> => {
    return new Promise((resolve, reject) => {
        if (!window.FB || typeof window.FB.api !== 'function') {
            return reject(new Error('Facebook SDK not initialized.'));
        }
        window.FB.api('/me/accounts?fields=name,access_token,picture', function(response: any) {
            if (response && !response.error) {
                resolve(response.data);
            } else {
                reject(handleFbApiError(response.error));
            }
        });
    });
};

const base64ToBlob = (base64: string, contentType: string = 'image/jpeg'): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
};

const publishTextPost = async ({ page, message, scheduledPublishTime }: PublishPostParams) => {
    const params = new URLSearchParams({
        message: message || '',
        access_token: page.access_token,
    });

    if (scheduledPublishTime) {
        params.append('published', 'false');
        params.append('scheduled_publish_time', String(Math.floor(scheduledPublishTime.getTime() / 1000)));
    }

    try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${page.id}/feed`, {
            method: 'POST',
            body: params,
        });
        const data = await res.json();
        if (data.error) {
            throw handleFbApiError(data.error);
        }
        return data;
    } catch (error) {
        console.error('Facebook text post error:', error);
        throw error;
    }
};

const publishPhoto = async ({ page, message, scheduledPublishTime, imageBase64, is360 }: PublishPostParams) => {
    if (!imageBase64) {
        throw new Error("Cannot publish a photo post without image data.");
    }

    const blob = base64ToBlob(imageBase64);
    const uploadFormData = new FormData();
    uploadFormData.append('source', blob);
    uploadFormData.append('access_token', page.access_token);
    uploadFormData.append('published', 'false'); // Always false for this flow

    if (is360) {
        uploadFormData.append('allow_spherical_photo', 'true');
    }

    // --- ONE-STEP PROCESS for SCHEDULED photo posts ---
    if (scheduledPublishTime) {
        uploadFormData.append('scheduled_publish_time', String(Math.floor(scheduledPublishTime.getTime() / 1000)));
        if (message) {
            uploadFormData.append('caption', message);
        }
        
        try {
            const uploadRes = await fetch(`https://graph.facebook.com/v21.0/${page.id}/photos`, {
                method: 'POST',
                body: uploadFormData,
            });
            const uploadData = await uploadRes.json();
            if (uploadData.error) throw handleFbApiError(uploadData.error);
            return uploadData; // This call returns a post_id when scheduled.
        } catch (error) {
            console.error('Facebook scheduled photo post error:', error);
            throw error;
        }
    }

    // --- TWO-STEP PROCESS for IMMEDIATE photo posts ---
    let photoId;
    try {
        const uploadRes = await fetch(`https://graph.facebook.com/v21.0/${page.id}/photos`, {
            method: 'POST',
            body: uploadFormData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.error) {
            throw handleFbApiError(uploadData.error);
        }
        photoId = uploadData.id;
    } catch (error) {
        console.error('Facebook photo upload (step 1) error:', error);
        throw error;
    }

    if (!photoId) {
        throw new Error("Failed to upload photo, could not get a valid photo ID.");
    }

    const postParams = new URLSearchParams({
        message: message || '',
        access_token: page.access_token,
        'attached_media[0]': JSON.stringify({ media_fbid: photoId }),
    });

    try {
        const postRes = await fetch(`https://graph.facebook.com/v21.0/${page.id}/feed`, {
            method: 'POST',
            body: postParams,
        });
        const postData = await postRes.json();
         if (postData.error) {
            throw handleFbApiError(postData.error);
        }
        return postData;
    } catch (error) {
        console.error('Facebook photo post (step 2) error:', error);
        throw error;
    }
};


export const publishPost = async (params: PublishPostParams): Promise<any> => {
    if (params.imageBase64) {
        return publishPhoto(params);
    } else {
        return publishTextPost(params);
    }
};

export const verifyManualToken = async (token: string, pageId: string): Promise<{ name: string, picture?: { data: { url: string }}}> => {
    try {
        const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}?fields=name,picture&access_token=${token}`);
        const data = await res.json();
        if (data.error) {
            throw handleFbApiError(data.error);
        }
        if (!data.name) {
            throw new Error('Invalid Token or Page ID. The token may have expired or lacks permissions for this Page.');
        }
        return data;
    } catch (error: any) {
        console.error('Facebook token verification error:', error);
        throw new Error(error.message || 'Failed to verify token with Facebook.');
    }
};