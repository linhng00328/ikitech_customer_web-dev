import { constants as c } from "../constants";
import { agencyServices as s } from "../services/agencyServices";
import { userActions } from "./userActions";

function getAgencyReport(query) {
  return (dispatch) => {
    s.getAgencyReport(query).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_AGENCY_REPORT_SUCCESS, data };
  }
  function failure(code, msg) {
    return { type: c.GET_AGENCY_REPORT_FAILURE, code, msg };
  }
}
function getAgencyReportImport(query) {
  return (dispatch) => {
    s.getAgencyReportImport(query).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_AGENCY_REPORT_IMPORT_SUCCESS, data };
  }
  function failure(code, msg) {
    return { type: c.GET_AGENCY_ORDERS_IMPORT_FAILURE, code, msg };
  }
}
function getAccountInfo() {
  return (dispatch) => {
    s.getAccountInfo().then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_AGENCY_ACCOUNT_SUCCESS, data };
  }
  function failure(code, msg) {
    return { type: c.GET_AGENCY_ACCOUNT_FAILURE, code, msg };
  }
}
function getInfo() {
  return (dispatch) => {
    s.getInfo().then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_AGENCY_INFO_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.GET_AGENCY_INFO_FAILURE, code, message };
  }
}
function getSharedOrder(query) {
  return (dispatch) => {
    s.getSharedOrder(query).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_SHARED_ORDERS_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.GET_SHARED_ORDERS_FAILURE, code, message };
  }
}
function getOrderImport(query) {
  return (dispatch) => {
    s.getOrderImport(query).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_AGENCY_ORDERS_IMPORT_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.GET_AGENCY_ORDERS_IMPORT_FAILURE, code, message };
  }
}
function getBalanceHistory(query) {
  return (dispatch) => {
    s.getBalanceHistory(query).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_BALANCE_HISTORY_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.GET_BALANCE_HISTORY_FAILURE, code, message };
  }
}
function getBonusHistory(query) {
  return (dispatch) => {
    s.getBonusHistory(query).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_BONUS_HISTORY_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.GET_BONUS_HISTORY_FAILURE, code, message };
  }
}
function requestPayment() {
  return (dispatch) => {
    s.requestPayment().then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        dispatch({
          type: c.CHANGE_POPUP,
          popupType: c.AUTOHIDE_POPUP,
          messageInfo: "Gửi yêu cầu thanh toán thành công",
        });
        dispatch(getInfo());
        return;
      }
      dispatch({
        type: c.CHANGE_POPUP,
        popupType: c.AUTOHIDE_POPUP,
        messageInfo: res.msg,
      });
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.REQUEST_PAYMENT_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.REQUEST_PAYMENT_FAILURE, code, message };
  }
}
function updateInfo(info, nonClose = false) {
  return (dispatch) => {
    s.updateInfo(info).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        if (nonClose != true) {
          dispatch({
            type: c.CHANGE_POPUP,
            popupType: c.AUTOHIDE_POPUP,
            messageInfo: "Cập nhật thông tin thành công",
          });
        }

        setTimeout(() => {
          s.getAccountInfo().then((res) => {
            if (res.code === 200 || res.code === 201) {
              dispatch({
                type: c.GET_AGENCY_ACCOUNT_SUCCESS,
                data: res.data,
              });
              return;
            }
            dispatch(failure(res.code, res.msg));
          });
        }, 1);
        return;
      }
      dispatch({
        type: c.CHANGE_POPUP,
        popupType: c.AUTOHIDE_POPUP,
        messageInfo: res.msg,
      });
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.UPDATE_AGENCY_INFO_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.UPDATE_INFO_AGENCY_FAILURE, code, message };
  }
}
function regisAgency() {
  return (dispatch) => {
    s.regisAgency(true).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch({
          type: c.CHANGE_POPUP,
          popupType: c.AUTOHIDE_POPUP,
          messageInfo:
            "Đăng ký Đại lý thành công vui lòng chờ phản hồi từ cửa hàng",
        });
        dispatch(userActions.getUserProfile());
        dispatch(userActions.getUserBadges());
        return;
      }
      dispatch({
        type: c.CHANGE_POPUP,
        popupType: c.AUTOHIDE_POPUP,
        messageInfo: res.msg,
      });
    });
  };
}
function cancelAgency() {
  return (dispatch) => {
    s.regisAgency(false).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch({
          type: c.CHANGE_POPUP,
          popupType: c.AUTOHIDE_POPUP,
          messageInfo: "Hủy CTV thành công vui lòng chờ phản hồi từ cửa hàng",
        });
        dispatch(userActions.getUserProfile());
        return;
      }
      dispatch({
        type: c.CHANGE_POPUP,
        popupType: c.AUTOHIDE_POPUP,
        messageInfo: res.msg,
      });
    });
  };
}
function getAgencyReferralCode(query) {
  return (dispatch) => {
    s.getAgencyReferralCode(query).then((res) => {
      if (res.code === 200 || res.code === 201) {
        dispatch(success(res.data));
        return;
      }
      dispatch(failure(res.code, res.msg));
    });
  };
  function success(data) {
    return { type: c.GET_AGENCY_REFERRAL_CODE_SUCCESS, data };
  }
  function failure(code, message) {
    return { type: c.GET_AGENCY_REFERRAL_CODE_FAILURE, code, message };
  }
}
export const agencyActions = {
  getInfo,
  updateInfo,
  getSharedOrder,
  getOrderImport,
  getAccountInfo,
  requestPayment,
  getBonusHistory,
  getBalanceHistory,
  regisAgency,
  cancelAgency,
  getAgencyReport,
  getAgencyReportImport,
  getAgencyReferralCode,
};
