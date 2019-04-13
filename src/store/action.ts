import {
  getUser,
  getAddressList
} from '../service/getData';
import {
  GET_USERINFO,
  SAVE_ADDRESS
} from './mutation-types';

export default {

  async getUserInfo({
    commit
  }) {
    const res = await getUser();
    commit(GET_USERINFO, res);
  },
  async saveAddress({ commit, state }) {
    if (state.removeAddress.length > 0) {
      return;
    }

    const addres = await getAddressList(state.userInfo.user_id);
    commit(SAVE_ADDRESS, addres);
  },
};
