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
  const spinner = document.getElementById('loadingSpinner'); // get the spinner
  try {
    spinner.classList.add('spin'); // add the spin class to the spinner, which makes it animate

    const response = await fetch('/stocks'); // now wait for the stocks list to be fetched
    
    if (!response.ok) {
      throw new Error(`${response.status} - ${response.statusText}`); // throw an error if the response is not ok to the catch block
    }

    const data = await response.json(); // now lets get the data from the response as JSON
    const stockSymbols = data.stockSymbols; // get the stock symbols from the data as an array

    console.log(stockSymbols); // log the stock symbols to the console, as part of the task

    stockSymbols.forEach(async symbol => { // go through each stock symbol
      try {
        const stockDataResponse = await fetch(`/stocks/${symbol}`); // fetch the stock data for that symbol, wait for a response
        
        if (!stockDataResponse.ok) {
          throw new Error(`${stockDataResponse.status} - ${stockDataResponse.statusText}`); // throw error to catch block if response is not ok
        }

        const stockData = await stockDataResponse.json(); // get the stock data as JSON
        console.log(stockData); // log it, as part of the task
      } catch (error) {
        alert(`Error fetching individual stock data for ${symbol}: ${error}`); // alert the user of the error for the specific stock via an alert box
        console.error(`Error fetching individual stock data for ${symbol}`, error); // and also put it in the console
      }
    });

    // spinner.classList.remove('spin'); // now we have loaded all the data (or we have errored in loading specific stock(S)), remove the spin class from the spinner, which stops the animation
    // spinner.hidden = true; // and hide the spinner
  } catch (error) {
    alert('Error fetching stock symbols list:\n' + error.message);  // alert the user of the error in the stock list via an alert box
    console.error('Error fetching stock symbols list:', error); // and also put it in the console
    // spinner.classList.remove('spin'); // remove the animation if we have errored
    // spinner.hidden = true; // and hide the spinner
  }
}

// Call the fetchData function
fetchData();
