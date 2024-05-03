import React from "react";
import styled from "styled-components";
import AgencyHistoryBalance from "./AgencyHistoryBalance";
import AgencyInformationWallet from "./AgencyInformationWallet";
import AgencyOrder from "./AgencyOrder";
import AgencyOrderImport from "./AgencyOrderImport";
import AgencyPayment from "./AgencyPayment";
import AgencyReportChart from "./AgencyReportChart";
import AgencyReportChartImport from "./AgencyReportChartImport";
import AgencyRewardLadder from "./AgencyRewardLadder";
import AgencyReferralCode from "./AgencyReferralCode";

const AgencyContentStyles = styled.div`
  width: 100%;
  background-color: white;
  border-radius: 0.25rem;
  padding: 1rem;
`;

const AgencyContent = ({ tabActive, setTabActive }) => {
  return (
    <AgencyContentStyles className="agency__content">
      {tabActive === "wallet" ? (
        <AgencyInformationWallet setTabActive={setTabActive} />
      ) : tabActive === "payment" ? (
        <AgencyPayment />
      ) : tabActive === "order_import" ? (
        <AgencyOrderImport />
      ) : tabActive === "order" ? (
        <AgencyOrder setTabActive={setTabActive} />
      ) : tabActive === "referralCode" ? (
        <AgencyReferralCode setTabActive={setTabActive} />
      ) : tabActive === "report_import" ? (
        <AgencyReportChartImport />
      ) : tabActive === "report" ? (
        <AgencyReportChart />
      ) : tabActive === "balance" ? (
        <AgencyHistoryBalance></AgencyHistoryBalance>
      ) : tabActive === "ladder" ? (
        <AgencyRewardLadder></AgencyRewardLadder>
      ) : null}
    </AgencyContentStyles>
  );
};

export default AgencyContent;
