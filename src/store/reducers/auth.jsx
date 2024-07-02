import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: !!localStorage.getItem('Token'),
    Id: localStorage.getItem('Id'),
    Name: localStorage.getItem('Name'),
    User: localStorage.getItem('User'), 
    Group: localStorage.getItem('Group'),
    Level: localStorage.getItem('Level'),
    Project: localStorage.getItem('Project'),
    Token: localStorage.getItem('Token'), 
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginUser: (state, { payload }) => {
            localStorage.setItem('Id', btoa(payload.Id));
            localStorage.setItem('Name', btoa(unescape(encodeURIComponent(payload.Name))));//btoa(payload.Name));  
            localStorage.setItem('User', btoa(payload.User)); 
            localStorage.setItem('Group', JSON.stringify(payload.Group));//btoa(payload.Group));
            localStorage.setItem('Level', JSON.stringify(payload.Level));
            localStorage.setItem('Project', JSON.stringify(payload.Project));
            localStorage.setItem('Token', btoa(payload.Token));

            //default menu
            localStorage.setItem('_activeid',10);
            localStorage.setItem('_path', 'Dashboard');
            localStorage.setItem('_page', 'Dashboard');

            state.isLoggedIn = true;
            state.Id = btoa(payload.Id);
            state.Name = btoa(unescape(encodeURIComponent(payload.Name)));//btoa(payload.Name);     
            state.User = btoa(payload.User);     
            state.Group = JSON.stringify(payload.Group);//btoa(payload.Group);
            state.Level = JSON.stringify(payload.Level);//btoa(payload.Level);
            state.Project = JSON.stringify(payload.Project);
            state.Token = btoa(payload.Token);  
        },
        logoutUser: (state) => {
            localStorage.removeItem('Id');
            localStorage.removeItem('Name');
            localStorage.removeItem('User');
            localStorage.removeItem('Group');
            localStorage.removeItem('Level');
            localStorage.removeItem('Project');
            localStorage.removeItem('Token');
          
            //state.currentUser = {};
            state.isLoggedIn = false;
            state.Id = 0;
            state.Name = null;  
            state.User = null;           
            state.Group = null;
            state.Level = null;
            state.Project = null;
            state.Token = null;
        },
        loadUser: (state, { payload }) => {
            state.currentUser = payload;
        }
    }
});

export const { loginUser, logoutUser, loadUser } = authSlice.actions;

export default authSlice.reducer;