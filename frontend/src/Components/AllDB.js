import React, { useState, useEffect } from 'react';

function ALLDB() {
  const [datasets, setDatasets] = useState([
    { name: 'playerData', data: [] },
    { name: 'sportsData', data: [] },
    // Add more dataset objects as needed
  ]);

  const [selectedDatasetIndex, setSelectedDatasetIndex] = useState(0);

  const fetchData = async (index) => {
    try {
      const name = datasets[index].name
      const response = await fetch(`http://localhost:5000/api/${name}`);
      const jsonData = await response.json();
      const updatedDatasets = [...datasets];
      updatedDatasets[index].data = jsonData;
      setDatasets(updatedDatasets);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data for initial dataset when the component mounts
  useEffect(() => {
    fetchData(selectedDatasetIndex);
  }, []);

  // Function to handle button click and fetch corresponding dataset
  const handleDatasetChange = async (index) => {
    setSelectedDatasetIndex(index);
    if (datasets[index].data.length === 0) {
      await fetchData(index);
    }
  };

  return (
    <div className="App">
      <div>
        {datasets.map((dataset, index) => (
          <button key={index} onClick={() => handleDatasetChange(index)}>
            {dataset.name}
          </button>
        ))}
      </div>
      <div>
        <h2>{datasets[selectedDatasetIndex].name}:</h2>
        <ul>
          {datasets[selectedDatasetIndex].data.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ALLDB;
