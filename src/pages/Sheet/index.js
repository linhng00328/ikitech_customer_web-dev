import Footer from "../../components/Footer";

function Sheet() {
  return (
    <>
      <div
        className="container"
        style={{
          width: "100vw",
          height: "70vh",
        }}
      >
        <iframe
          style={{
            width: "100%",
            height: "100%",
          }}
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTG7akZdvDpa8SmYKlaLWSRkrkB3Z0FwBfqUxZ6yWddYIrEUIhnKqkFpM3YPgk9u5dPo0dpjJjGDQ59/pubhtml?widget=true&amp;headers=false"
        ></iframe>
      </div>
      <Footer />
    </>
  );
}

export default Sheet;
