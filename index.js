require("./db");
const express = require("express");
const { PORT } = require("./config");
const entryRoutes = require("./routes/entryRoutes")

const app = express();

// Middleware
app.use(express.json());
app.use( '/api', entryRoutes )


// Start the server
app.listen(PORT, _ => console.log(`Server is running on port ${PORT}`));

let array=[0 , 1,  2,  2, 1, 0, 0, 0, 2, 2, 1, 1]
// just create an api with node js
//  set all the number according to asc order(without any sort method)and return it as response

function AscendingSort(array){
    if(!Array.isArray(array)) return false

    for(let i=0; i < array.length - 1 ; i++){
        for(let j=0; j < array.length - i - 1; j++){

            if(array[j] > array[j + 1]){
                const temp = array[j];

                array[j] = array[j + 1];
                array[j + 1] = temp;    
            }
            
        }
    }
    
    console.log(array)

    return array;
}

app.get('/asc-array', (req, res) => {
    let ascArray = AscendingSort([0 , 1,  2,  2, 1, 0, 0, 0, 2, 2, 1, 1])

    res.status(201).json({
        ascArray
    })
})

// Routes
app.get("/", (_, res) => res.send("Welcome Hero, Your site is live 😍😍!"));