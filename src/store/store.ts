import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userAPI } from "../service/UserService";
import logger from 'redux-logger';
import { documentAPI } from "../service/DocumentService";
import { chatRoomAPI } from "../service/ChatRoomService";
import { questionnaireAPI } from "../service/QuestionnaireService";

// Combine all reducers into a single root reducer
// The computed property name [userAPI.reducerPath] dynamically assigns the reducer
// to the correct path in the state tree (likely 'userAPI')
const rootReducer = combineReducers({
    [userAPI.reducerPath]: userAPI.reducer, // set reducer to api reducer path
    [documentAPI.reducerPath]: documentAPI.reducer,
    [chatRoomAPI.reducerPath]: chatRoomAPI.reducer,
    [questionnaireAPI.reducerPath]: questionnaireAPI.reducer
});

/**
 * Creates and configures the Redux store
 * @returns A configured Redux store with middleware
 */
export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => 
            // Disable serializable check for non-serializable values in state
            getDefaultMiddleware({ serializableCheck: false  })
            // Add RTK Query middleware for handling API requests, caching, etc.
            .concat(userAPI.middleware)
            .concat(documentAPI.middleware)
            .concat(chatRoomAPI.middleware)
            .concat(questionnaireAPI.middleware)
            // Add logger middleware for debugging actions and state changes
            .concat(logger)
    })
};

// Extract the root state type from the rootReducer using TypeScript utility type ReturnType
// This provides proper typing for useSelector hooks
export type RootState = ReturnType<typeof rootReducer>;

// Extract the store type from the setupStore function
// This is useful for creating typed hooks and testing utilities
export type AppStore = ReturnType<typeof setupStore>;

// Extract the dispatch type from the store
// This provides proper typing for useDispatch hook and dispatch calls
export type AppDispatch = AppStore['dispatch'];
