import { toast } from 'react-toastify';
import api from '../../api';
import {
    REMOVE_USER,
    SET_USER,
    SET_ROLE,
    SET_USERS,
    USER_LOGIN_FAIL,
    RESET_MESSAGE,
    USER_RESTORE_FAIL,
    USER_RESTORE_SUCCESS,
    USER_RESTORE_REQUEST,
    USER_DESTROY_FAIL,
    USER_DESTROY_SUCCESS,
    USER_DESTROY_REQUEST,
    USER_DELETE_FAIL,
    USER_DELETE_SUCCESS,
    USER_DELETE_REQUEST,
    USER_INFO_REQUEST,
    USER_INFO_SUCCESS,
    USER_INFO_FAIL,
} from '../../constants/userConstant';

//GET ACTION BEGIN
export const getUsers = () => async (dispatch) => {
    try {
        const res = await api.get('api/user');
        dispatch({
            type: SET_USERS,
            payload: res.data,
        });
    } catch (e) {
        console.log(e);
    }
};

export const getUser = (id) => async (dispatch) => {
    try {
        const res = await api.get('api/user/' + id + '/edit');
        dispatch({
            type: SET_USER,
            payload: res.data,
        });
    } catch (e) {
        console.log(e);
    }
};

export const getUserGoogle = () => async (dispatch) => {
    try {
        await api
            .get('api/user/login-google/success', { withCredentials: true })
            .then((res) => {
                if (res.data) {
                    localStorage.setItem(
                        'userInfo',
                        JSON.stringify(res.data.info)
                    );
                    toast.success(res.data.message);
                    dispatch({
                        type: SET_USER,
                        payload: res.data.info,
                    });
                }
            })
            .catch((err) => console.log(err));
    } catch (e) {
        console.log(e);
    }
};

export const getUserFacebook = () => async (dispatch) => {
    try {
        await api
            .get('api/user/login-facebook/success', {
                withCredentials: true,
            })
            .then((res) => {
                if (res.data) {
                    localStorage.setItem(
                        'userInfo',
                        JSON.stringify(res.data.info)
                    );
                    toast.success(res.data.message);
                    dispatch({
                        type: SET_USER,
                        payload: res.data.info,
                    });
                }
            })
            .catch((err) => console.log(err));
    } catch (e) {
        console.log(e);
    }
};

export const getTrashUsers = () => async (dispatch) => {
    try {
        const res = await api.get('api/user/trash');
        dispatch({
            type: SET_USERS,
            payload: res.data,
        });
    } catch (e) {
        console.log(e);
    }
};

export const getRole = (data) => async (dispatch) => {
    try {
        const res = await api.post('api/user/userRole', { id: data });
        dispatch({
            type: SET_ROLE,
            payload: res.data,
        });
    } catch (e) {
        console.log(e);
    }
};
//GET ACTION BEGIN

//POST ACTION BEGIN
export const register = (data) => async (dispatch) => {
    try {
        // console.log(data)
        const res = await api.post('api/user/register', {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            phone: data.phone,
            sex: data.sex,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
        });
        if (res.data.info) {
            localStorage.setItem('userInfo', JSON.stringify(res.data.info));
            localStorage.setItem(
                'message-user',
                JSON.stringify(res.data.message)
            );
            dispatch({
                type: SET_USER,
                payload: res.data.info,
            });
            document.location.href = '/';
        } else {
            dispatch({
                type: USER_LOGIN_FAIL,
                payload: res.data.message,
            });
            localStorage.setItem(
                'message-user_error',
                JSON.stringify(res.data)
            );
        }
    } catch (e) {
        console.log(e);
    }
};

export const login = (data) => async (dispatch) => {
    try {
        const res = await api.post('api/user/login', {
            email: data.email,
            password: data.password,
        });
        if (res.data.info) {
            const user = {
                _id: res.data.info._id,
                firstName: res.data.info.firstName,
                lastName: res.data.info.lastName,
                phone: res.data.info.phone,
                email: res.data.info.email,
                address: res.data.info.address,
                role: res.data.info.role,
                sex: res.data.info.sex,
                dateOfBirth: res.data.info.dateOfBirth,
                avatar: res.data.info.avatar,
                token: res.data.info.token,
            };
            localStorage.setItem('userInfo', JSON.stringify(user));
            localStorage.setItem(
                'message-user',
                JSON.stringify(res.data.message)
            );
            dispatch({
                type: SET_USER,
                payload: res.data.info,
            });
            document.location.href = '/';
        } else {
            dispatch({
                type: USER_LOGIN_FAIL,
                payload: res.data.message,
            });
            localStorage.setItem(
                'message-user_error',
                JSON.stringify(res.data)
            );
        }
    } catch (error) {
        console.log(error.response);
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response.data.message,
        });
        localStorage.setItem(
            'message-user_error',
            JSON.stringify(error.response.data)
        );
    } finally {
        dispatch({ type: RESET_MESSAGE });
    }
};
//POST ACTION END

//LOGOUT ACTION
export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('persist:root');
    localStorage.removeItem('authGoogle');
    localStorage.removeItem('authFacebook');
    localStorage.setItem(
        'message-user',
        JSON.stringify({ message: 'Đăng xuất thành công!' })
    );
    dispatch({ type: REMOVE_USER });
    document.location.href = '/';
};

//DELETE ACTION BEGIN
export const deleteUsers = (data) => async (dispatch) => {
    dispatch({ type: USER_DELETE_REQUEST });
    try {
        const ids = { id: data };
        const isDeleted = await api.delete('api/user', { data: ids });
        if (isDeleted) {
            toast.success('Người dùng đã được đưa vào thùng rác !');
            dispatch({
                type: USER_DELETE_SUCCESS,
            });
        }
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: USER_DELETE_FAIL, payload: message });
    }
};

export const destroyUsers = (data) => async (dispatch) => {
    dispatch({ type: USER_DESTROY_REQUEST });
    try {
        const ids = { id: data };
        const isDestroy = await api.delete('api/user/force', { data: ids });
        if (isDestroy) {
            toast.success('Người dùng đã được xóa hoàn toàn !');
            dispatch({
                type: USER_DESTROY_SUCCESS,
            });
        }
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: USER_DESTROY_FAIL, payload: message });
    }
};
//DELETE ACTION END

//RESTORE ACTION
export const restoreUsers = (data) => async (dispatch) => {
    dispatch({ type: USER_RESTORE_REQUEST });
    try {
        const ids = { id: data };

        const isRestore = await api.patch('api/user/restore', {
            data: ids.id.split(','),
        });
        if (isRestore) {
            toast.success('Người dùng đã được phục hồi !');
            dispatch({
                type: USER_RESTORE_SUCCESS,
            });
        }
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: USER_RESTORE_FAIL, payload: message });
    }
};

//ADD FAVORITE ACTION
export const favoritesAdd = (data) => async (dispatch) => {
    try {
        const id = JSON.parse(localStorage.getItem('userInfo'))._id;
        const res = await api.patch('api/user/' + id + '/favorites', {
            idPro: data,
        });
        if (res.data) {
            console.log(res.data);
        }
    } catch (e) {
        console.log(e);
    }
};

//PUT ACTION
export const updateUser = (user) => async (dispatch) => {
    try {
        const data = await api.put(`api/user/${user.id}`, user);
        if (data) {
            console.log(data.data);
            document.location.href = '/admin/users';
        }
    } catch (e) {
        console.log(e);
    }
};

//PUT ACTION
export const updateUserInfo = (user) => async (dispatch) => {
    dispatch({ type: USER_INFO_REQUEST });
    try {
        const res = await api.put(`api/user/${user.id}/info`, user.formData);
        if (res.data.data) {
            var userNew = JSON.parse(localStorage.getItem('userInfo'));
            userNew.avatar = res.data.data.avatar;
            userNew.address = res.data.data.address;
            userNew.dateOfBirth = res.data.data.dateOfBirth;
            userNew.firstName = res.data.data.firstName;
            userNew.lastName = res.data.data.lastName;
            userNew.phone = res.data.data.phone;
            userNew.sex = res.data.data.sex;
            localStorage.setItem('userInfo', JSON.stringify(userNew));
            dispatch({
                type: USER_INFO_SUCCESS,
            });
        }
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        dispatch({ type: USER_INFO_FAIL, payload: message });
    }
};

export const postImgUser = (data) => async (dispatch) => {
    try {
        await api.post('api/user/imagePost', data);
    } catch (e) {
        console.log(e);
    }
};

// Forget PassWord Begin
export const forget = (user) => async (dispatch) => {
    try {
        await api.post(`api/user/forgetPassword`, user);
        // localStorage.setItem('user', JSON.stringify(data.data));
    } catch (e) {
        console.log(e);
    }
};

export const change = (values) => async (dispatch) => {
    try {
        const data = await api.put(`api/user/changePassword`, values);
        if (data.data.user) {
            alert(data.data.message);
            localStorage.setItem('userInfo', JSON.stringify(data.data.user));
            document.location.href = '/';
        } else {
            toast.error(data.data.message);
        }
    } catch (e) {
        console.log(e);
    }
};

// Forget PassWord End

//OPEN GOOGLE
export const openGoogle = () => async (dispatch) => {
    try {
        window.open('http://localhost:5000/api/user/login-google', '_self');
    } catch (e) {
        console.log(e);
    }
};

//OPEN FACEBOOK
export const openFacebook = () => async (dispatch) => {
    try {
        window.open('http://localhost:5000/api/user/login-facebook', '_self');
    } catch (e) {
        console.log(e);
    }
};
