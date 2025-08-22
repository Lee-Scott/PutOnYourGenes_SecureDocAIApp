import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userAPI } from "../service/UserService";
import { paperlessApi } from "../service/PaperlessService";
import { documentAPI } from "../service/DocumentService";
import { chatRoomAPI } from "../service/ChatRoomService";
import { questionnaireAPI } from "../service/QuestionnaireService";
import homepageReducer, { HomepageState } from './slices/homepageSlice';
import integrationReducer, { IntegrationState } from './slices/integrationSlice';

// Combine all reducers into a single root reducer
// The computed property name [userAPI.reducerPath] dynamically assigns the reducer
// to the correct path in the state tree (likely 'userAPI')
const rootReducer = combineReducers({
    [userAPI.reducerPath]: userAPI.reducer, // set reducer to api reducer path
    [documentAPI.reducerPath]: documentAPI.reducer,
    [paperlessApi.reducerPath]: paperlessApi.reducer,
    [chatRoomAPI.reducerPath]: chatRoomAPI.reducer,
    [questionnaireAPI.reducerPath]: questionnaireAPI.reducer,
    homepage: homepageReducer,
    integration: integrationReducer,
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
            .concat(paperlessApi.middleware)
            .concat(chatRoomAPI.middleware)
            .concat(questionnaireAPI.middleware)
    })
};

// Extract the store type from the setupStore function
// This is useful for creating typed hooks and testing utilities
export type AppStore = ReturnType<typeof setupStore>;

// This provides proper typing for useSelector hooks
export type RootState = {
    [userAPI.reducerPath]: ReturnType<typeof userAPI.reducer>;
    [documentAPI.reducerPath]: ReturnType<typeof documentAPI.reducer>;
    [paperlessApi.reducerPath]: ReturnType<typeof paperlessApi.reducer>;
    [chatRoomAPI.reducerPath]: ReturnType<typeof chatRoomAPI.reducer>;
    [questionnaireAPI.reducerPath]: ReturnType<typeof questionnaireAPI.reducer>;
    homepage: HomepageState;
    integration: IntegrationState;
  };

// Extract the dispatch type from the store
// This provides proper typing for useDispatch hook and dispatch calls
export type AppDispatch = AppStore['dispatch'];
