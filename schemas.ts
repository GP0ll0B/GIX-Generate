import { Type } from "@google/genai";

// =================================================================
// JSON SCHEMAS
// =================================================================

export const TEXT_POST_WITH_SAFETY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    caption: { 
      type: Type.STRING,
      description: "The main text content for the social media post, based on the user's topic and the provided image."
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of 3-5 relevant hashtags for the post."
    },
    safetyAnalysis: {
      type: Type.OBJECT,
      description: "An analysis of the generated content for safety and moderation.",
      properties: {
        isSafe: { 
          type: Type.BOOLEAN,
          description: "Whether the generated caption is considered safe and appropriate for all audiences."
        },
        reasoning: {
          type: Type.STRING,
          description: "A brief, one-sentence explanation for the safety classification."
        }
      }
    }
  }
};

export const VQA_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    question: { 
      type: Type.STRING,
      description: "The user's original question about the image."
    },
    answer: {
      type: Type.STRING,
      description: "A direct and concise answer to the user's question based on the visual information in the image."
    },
    reasoning: {
      type: Type.STRING,
      description: "A brief, one-sentence explanation of how the answer was derived from the image content."
    }
  }
};

export const POST_ENGAGEMENT_STRATEGY_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        simulatedComments: {
            type: Type.ARRAY,
            description: "An array of 3 diverse, simulated user comments (positive, negative, question).",
            items: {
                type: Type.OBJECT,
                properties: {
                    username: { type: Type.STRING, description: "A plausible-sounding social media username." },
                    comment: { type: Type.STRING, description: "The text of the simulated comment." },
                    type: { type: Type.STRING, enum: ['Positive', 'Negative', 'Question'] }
                }
            }
        },
        suggestedReplies: {
            type: Type.ARRAY,
            description: "An array of 3 on-brand, strategic replies, one for each comment type.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, enum: ['Positive', 'Negative', 'Question'] },
                    reply: { type: Type.STRING, description: "The suggested reply text." }
                }
            }
        },
        boostStrategy: {
            type: Type.OBJECT,
            description: "A concise, actionable strategy for boosting the post.",
            properties: {
                recommendation: { type: Type.STRING, description: "A specific recommendation, e.g., 'Boost after 24 hours to a lookalike audience if engagement exceeds 5%'." },
                simulatedOutcome: { type: Type.STRING, description: "A plausible simulated outcome, e.g., 'Estimated +5k reach and +250 interactions.'" }
            }
        },
        followUpPostIdea: {
            type: Type.STRING,
            description: "A single, creative idea for a follow-up post that builds on the original topic."
        }
    }
};

// FIX: Added a new schema for generating a post and its engagement strategy together.
export const POST_WITH_ENGAGEMENT_STRATEGY_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        basePost: {
            type: Type.OBJECT,
            description: "The generated base social media post.",
            properties: {
                caption: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                safetyAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                        isSafe: { type: Type.BOOLEAN },
                        reasoning: { type: Type.STRING }
                    }
                }
            }
        },
        engagementStrategy: POST_ENGAGEMENT_STRATEGY_SCHEMA
    }
};

export const STRATEGY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    content_strategies: {
      type: Type.OBJECT,
      properties: {
        relevance_score: { type: Type.NUMBER },
        engagement_rate: { type: Type.NUMBER },
        video_views: { type: Type.NUMBER },
        video_completion_rate: { type: Type.NUMBER },
        content_types: { type: Type.ARRAY, items: { type: Type.STRING } },
        topics: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    engagement_tactics: {
      type: Type.OBJECT,
      properties: {
        response_time: { type: Type.NUMBER },
        conversation_depth: { type: Type.NUMBER },
        private_sharing_rate: { type: Type.NUMBER },
        call_to_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    optimization_parameters: {
      type: Type.OBJECT,
      properties: {
        posting_schedule: {
          type: Type.OBJECT,
          properties: {
            peak_hours: { type: Type.ARRAY, items: { type: Type.STRING } },
            weekend_hours: { type: Type.ARRAY, items: { type: Type.STRING } },
            timezone: { type: Type.STRING },
          },
        },
        insights_tracking: {
          type: Type.OBJECT,
          properties: {
            watch_time: { type: Type.NUMBER },
            shares: { type: Type.NUMBER },
            retention_rate: { type: Type.NUMBER },
            metrics_to_track: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
      },
    },
     mathematical_models: {
          type: Type.OBJECT,
          properties: {
            engagement_prediction: {
              type: Type.OBJECT,
              properties: {
                formula: { type: Type.STRING },
                variables: {
                  type: Type.OBJECT,
                  properties: {
                    E: { type: Type.STRING },
                    V: { type: Type.STRING },
                    S: { type: Type.STRING },
                    C: { type: Type.STRING },
                    w1: { type: Type.STRING },
                    w2: { type: Type.STRING },
                    w3: { type: Type.STRING },
                  },
                },
                prediction_interval: { type: Type.NUMBER },
                confidence_level: { type: Type.NUMBER },
              },
            },
          },
        },
        audience_insights: {
          type: Type.OBJECT,
          properties: {
            demographics: {
              type: Type.OBJECT,
              properties: {
                age_range: { type: Type.STRING },
                gender_distribution: { type: Type.STRING },
                top_countries: { type: Type.ARRAY, items: { type: Type.STRING } },
                interests: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
            behavioral_insights: {
              type: Type.OBJECT,
              properties: {
                active_hours: { type: Type.ARRAY, items: { type: Type.STRING } },
                device_usage: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
            },
          },
        },
        performance_analytics: {
            type: Type.OBJECT,
            properties: {
                page_views_by_content_type: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            content_type: { type: Type.STRING },
                            total_percentage: { type: Type.NUMBER },
                            follower_breakdown: {
                                type: Type.OBJECT,
                                properties: {
                                    followers_percentage: { type: Type.NUMBER },
                                    non_followers_percentage: { type: Type.NUMBER },
                                },
                            },
                        },
                    },
                },
            },
        },
        monetization_forecast: {
            type: Type.OBJECT,
            properties: {
                approximate_earnings: {
                    type: Type.OBJECT,
                    properties: {
                        total_usd: { type: Type.NUMBER },
                        breakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    source: { type: Type.STRING },
                                    earnings_usd: { type: Type.NUMBER },
                                },
                            },
                        },
                        note: { type: Type.STRING },
                    },
                },
            },
        },
  },
};

export const VOICE_DIALOG_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        dialog: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    speaker: { type: Type.STRING, enum: ['User', 'Stella'] },
                    line: { type: Type.STRING }
                }
            }
        }
    }
};

export const COMMENT_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        overall_sentiment: { type: Type.STRING, enum: ['Positive', 'Negative', 'Mixed', 'Neutral'] },
        sentiment_score: { type: Type.NUMBER },
        key_themes: { type: Type.ARRAY, items: { type: Type.STRING } },
        frequent_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        actionable_insights: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};

export const PAGE_PERFORMANCE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        strategic_summary: { type: Type.STRING, description: "A high-level summary of the page's performance based on the data." },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of 3-5 actionable recommendations for improvement." },
        top_post_insight: { type: Type.STRING, description: "A specific, concise insight about why the top-performing post was successful." }
    }
};


export const BRAND_ALIGNMENT_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER },
        rationale: { type: Type.STRING },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    }
};

export const PAGE_GROWTH_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['Content Strategy', 'Audience Engagement', 'Monetization'] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
      },
    },
  },
};

export const INSPIRATION_HUB_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    trending_topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          description: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
      },
    },
    top_hashtags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          hashtag: { type: Type.STRING },
          popularity_score: { type: Type.NUMBER },
          usage_tip: { type: Type.STRING },
        },
      },
    },
    viral_formats: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          format_name: { type: Type.STRING },
          description: { type: Type.STRING },
          example_idea: { type: Type.STRING },
        },
      },
    },
  },
};

export const STELLA_NLU_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: ['SET_REMINDER', 'GET_WEATHER', 'CONTROL_DEVICE', 'GET_SPORTS_SCORE', 'CONVERSATIONAL']
    },
    entities: {
      type: Type.OBJECT,
      properties: {
        task: { type: Type.STRING },
        time: { type: Type.STRING },
        location: { type: Type.STRING },
        device_name: { type: Type.STRING },
        device_state: { type: Type.STRING, enum: ['on', 'off'] },
        team_name: { type: Type.STRING },
      },
    },
  },
};

export const VIRAL_HOOK_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        hooks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    }
};

export const BRAND_VOICE_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        brandSummary: { 
            type: Type.STRING,
            description: "A concise summary of the overall brand voice and identity based on the provided inputs."
        },
        coreKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5-7 core keywords that encapsulate the brand's values and mission."
        },
        personaInANutshell: {
            type: Type.STRING,
            description: "A single, impactful sentence that captures the essence of the brand's persona."
        }
    }
};

export const LIFECYCLE_IDEAS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        ideas: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: {
                        type: Type.STRING,
                        description: "A clear, concise topic for a piece of content."
                    },
                    rationale: {
                        type: Type.STRING,
                        description: "A brief explanation of why this topic is relevant and compelling for the brand."
                    }
                }
            }
        }
    }
};

export const LIFECYCLE_DISCOVERY_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        social_posts: {
            type: Type.ARRAY,
            description: "A list of posts for different social media platforms.",
            items: {
                type: Type.OBJECT,
                properties: {
                    platform: {
                        type: Type.STRING,
                        description: "The target social media platform (e.g., Facebook, X, LinkedIn)."
                    },
                    message: {
                        type: Type.STRING,
                        description: "The content of the social media post."
                    }
                }
            }
        },
        community_posts: {
            type: Type.ARRAY,
            description: "A list of suggestions for posting in online communities.",
            items: {
                type: Type.OBJECT,
                properties: {
                    community: {
                        type: Type.STRING,
                        description: "The target community (e.g., r/futurology, a specific LinkedIn group)."
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "A brief suggestion on how to frame the post for that community."
                    }
                }
            }
        }
    }
};

export const LIFECYCLE_VISUALS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        visual_ideas: {
            type: Type.ARRAY,
            description: "A list of visual concepts for the content.",
            items: {
                type: Type.OBJECT,
                properties: {
                    concept: {
                        type: Type.STRING,
                        description: "A brief description of the visual concept."
                    },
                    image_prompt: {
                        type: Type.STRING,
                        description: "A detailed, descriptive prompt for an AI image generator."
                    }
                }
            }
        }
    }
};

export const AUTOMATED_RESPONDER_FLOW_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        welcomeMessage: {
            type: Type.STRING,
            description: "The initial welcome message sent to a user."
        },
        quickReplies: {
            type: Type.ARRAY,
            description: "A list of 3-4 suggested quick reply buttons and their corresponding responses.",
            items: {
                type: Type.OBJECT,
                properties: {
                    label: {
                        type: Type.STRING,
                        description: "The short text label for the quick reply button (e.g., 'See Products')."
                    },
                    response: {
                        type: Type.STRING,
                        description: "The full response the bot should send when this quick reply is clicked."
                    }
                }
            }
        },
        fallbackMessage: {
            type: Type.STRING,
            description: "A message to send if the user doesn't interact or says something the bot doesn't understand."
        }
    }
};

export const WHATSAPP_AUTO_RESPONDER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        system_prompt: {
            type: Type.STRING,
            description: "The system prompt that defines the AI's persona, knowledge, and rules for the WhatsApp bot."
        },
        welcome_message: {
            type: Type.STRING,
            description: "The initial message sent to a user when they start a conversation."
        },
        common_questions: {
            type: Type.ARRAY,
            description: "A list of common questions and their pre-defined answers.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question_pattern: {
                        type: Type.STRING,
                        description: "A simple regex pattern or keywords to match a user's question (e.g., '(hours|open|close)')."
                    },
                    response: {
                        type: Type.STRING,
                        description: "The bot's answer to the corresponding question."
                    }
                }
            }
        },
        fallback_message: {
            type: Type.STRING,
            description: "A polite message to send when the bot doesn't understand the user's query."
        }
    }
};

export const PAGE_IMPORT_ANALYSIS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        brandName: {
            type: Type.STRING,
            description: "The name of the brand or page."
        },
        brandBio: {
            type: Type.STRING,
            description: "The primary bio, intro, or 'about' text for the brand."
        },
        toneOfVoice: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-5 adjectives describing the brand's tone (e.g., 'Visionary', 'Poetic', 'Technical')."
        },
        keyThemes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-5 core topics or themes present in the content."
        },
        nextPostSuggestion: {
            type: Type.STRING,
            description: "A creative and on-brand suggestion for the next social media post."
        }
    }
};

export const DASHBOARD_IMPORTER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        todo_list: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of pending tasks or notifications. If none, return an empty array."
        },
        weekly_goals: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    task: { type: Type.STRING, description: "The description of the weekly goal." },
                    progress: { type: Type.NUMBER, description: "The current progress towards the goal." },
                    target: { type: Type.NUMBER, description: "The target number for the goal." }
                }
            },
            description: "A list of weekly goals with their progress."
        },
        performance_summary: {
            type: Type.OBJECT,
            properties: {
                metric: { type: Type.STRING, description: "The name of the main performance metric (e.g., 'Views')." },
                value: { type: Type.STRING, description: "The value of the metric (e.g., '808')." },
                trend: { type: Type.STRING, description: "The trend percentage (e.g., '+1,823.8%')." }
            },
            description: "The primary KPI from the dashboard insights."
        },
        monetization_status: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING, description: "The main monetization status (e.g., 'No Monetization Violations')." },
                details: { type: Type.STRING, description: "Further details on monetization eligibility or issues." }
            },
            description: "The page's current monetization status."
        },
        latest_post_summary: {
            type: Type.STRING,
            description: "The full text content of the most recent Facebook post found in the data."
        }
    }
};