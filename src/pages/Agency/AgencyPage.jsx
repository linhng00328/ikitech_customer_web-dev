import React, { useState } from "react";
import styled from "styled-components";
import Footer from "../../components/Footer";
import { useSelector } from "react-redux";
import StopWorking from "./child/StopWorking";
import AgencyTabs from "./child/AgencyTabs";
import AgencyContent from "./child/AgencyContent";

const AgencyPageStyles = styled.div`
  min-height: calc(100vh - 8.5em);
  padding: 1em 0;
  .container {
    padding: 0 !important;
  }
  .agency__main {
    width: 100%;
    display: flex;
    column-gap: 20px;
    background-color: #f7f7f7;
  }
  @media only screen and (max-width: 976px) {
    .agency__main {
      flex-direction: column;
      row-gap: 15px;
    }
  }
`;

const AgencyPage = () => {
  const profile = useSelector((state) => state.user.profile);
  const badges = useSelector((state) => state.user.badges);

  const [tabActive, setTabActive] = useState("wallet");

  return (
    <>
      {profile.is_agency && badges.status_agency === 1 ? (
        <>
          <AgencyPageStyles className="agency agency-page">
            <div className="container">
              <div className="agency__main">
                <AgencyTabs
                  setTabActive={setTabActive}
                  tabActive={tabActive}
                ></AgencyTabs>
                <AgencyContent
                  tabActive={tabActive}
                  setTabActive={setTabActive}
                ></AgencyContent>
              </div>
            </div>
          </AgencyPageStyles>
          <Footer />
        </>
      ) : (
        <>
          <div className="collaborator-page">
            <StopWorking badges={badges} />
          </div>
          <Footer />
        </>
      )}
    </>
  );
};
export { AgencyPage };
