import React, { useState, useEffect } from "react";

interface IndexItem {
  id: number;
  prognoselink: string;
  farbe: string;
  badestellelink: string;
  badname: string;
  bezirk: string;
  dat: string;
  cb: string;
  eco: string;
  ente: string;
  sicht: string;
  temp: string;
  profil: string;
  profillink: string;
  pdflink: string;
  rss_name: string;
  bsl: string;
  algen: string;
  wasserqualitaet: number;
  farb_id: number;
  wasserqualitaet_lageso: string | null;
  wasserqualitaet_predict: string;
  dat_predict: string;
}

const IndexComponent: React.FC = () => {
  const [indexData, setIndexData] = useState<IndexItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://www.berlin.de/lageso/gesundheit/gesundheitsschutz/badegewaesser/liste-der-badestellen/index.php/index/all.json?q="
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData = await response.json();
        setIndexData(
          jsonData.index.map((item: IndexItem) => ({
            ...item,
            // Extracting URL from badestellelink
            badestellelink: extractURL(item.badestellelink),
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to extract URL from badestellelink
  const extractURL = (str: string): string => {
    const startIndex = str.indexOf("/lageso/");
    if (startIndex !== -1) {
      const url = str.substring(startIndex);
      return url;
    }
    return "";
  };

  // Function to handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle click on bezirk text
  const handleBezirkClick = (bezirk: string) => {
    setSearchQuery(bezirk);
  };

  // Function to toggle collapse state for an item
  const toggleCollapse = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Filter indexData based on searchQuery
  const filteredData = indexData.filter((item) =>
    item.bezirk.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <h2>Öffentliche Badestellen in Berlin</h2>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Nach Bezirk suchen"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <div className="accordion">
        {filteredData.map((item, index) => (
          <div className="accordion-item" key={item.id}>
            <div>
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    openIndex !== index ? "collapsed" : ""
                  }`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${index}`}
                  aria-controls={`collapse-${index}`}
                  aria-expanded={openIndex === index ? "true" : "false"}
                  onClick={() => toggleCollapse(index)}
                >
                  {item.badname}
                </button>
              </h2>
              <div
                className={`accordion-body ${
                  openIndex === index ? "show" : "collapse"
                }`}
              >
                <div className="accordion-body">
                  <ul className="list-group">
                    <li
                      className="list-group-item"
                      onClick={() => handleBezirkClick(item.bezirk)}
                    >
                      Bezirk: <a href="#">{item.bezirk}</a>
                    </li>
                    <li className="list-group-item">
                      <a href={"https://www.berlin.de" + item.badestellelink}>
                        Badestelle Link
                      </a>
                    </li>
                    <li className="list-group-item">Date: {item.dat}</li>
                    <li className="list-group-item">CB: {item.cb}</li>
                    <li className="list-group-item">Eco: {item.eco}</li>
                    <li className="list-group-item">Ente: {item.ente}</li>
                    <li className="list-group-item">Sicht: {item.sicht}</li>
                    <li className="list-group-item">Temperatur: {item.temp}</li>
                    <li className="list-group-item">
                      Wasserqualität: {item.wasserqualitaet}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexComponent;
