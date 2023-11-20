const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

function drawLine(start, end, style) {
  ctx.beginPath();
  ctx.strokeStyle = style || 'black';
  ctx.moveTo(...start);
  ctx.lineTo(...end);
  ctx.stroke();
}

function drawTriangle(apex1, apex2, apex3) {
  ctx.beginPath();
  ctx.moveTo(...apex1);
  ctx.lineTo(...apex2);
  ctx.lineTo(...apex3);
  ctx.fill();
}

drawLine([50, 50], [50, 550]); // y-axis top coord, bottom coord
drawTriangle([35, 50], [65, 50], [50, 35]);

drawLine([50, 550], [950, 550]); // x-axis left coord, right coord
drawTriangle([950, 535], [950, 565], [965, 550]);

async function fetchData() {
  const spinner = document.getElementById('loadingSpinner');
  try {
    spinner.classList.add('spin');

    const response = await fetch('/stocks');
    
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const stockSymbols = data.stockSymbols;

    console.log(stockSymbols);

    stockSymbols.forEach(async symbol => {
      try {
        const stockDataResponse = await fetch(`/stocks/${symbol}`);
        
        if (!stockDataResponse.ok) {
          throw new Error(`${stockDataResponse.status} - ${stockDataResponse.statusText}`);
        }

        const stockData = await stockDataResponse.json();
        console.log(stockData);
      } catch (error) {
        alert(`Error fetching individual stock data for ${symbol}: ${error}`);
        console.error(`Error fetching individual stock data for ${symbol}`, error);
      }
    });

    spinner.classList.remove('spin');
    spinner.hidden = true;
  } catch (error) {
    alert('Error fetching stock symbols list:\n' + error.message);
    console.error('Error fetching stock symbols list:', error);
    spinner.classList.remove('spin');
    spinner.hidden = true;
  }
}

// Call the fetchData function
fetchData();
