
export interface PageOptions {offset:number,limit:number}

export interface PageResult<T>{
    data:T[];
    matched:number;
    total:number;
}

// function that takes an array of T and returns nothing
export default function displayTable<T>(dataSet: PageResult<T>) {
    if(dataSet.data.length === 0) {
        console.log("No data available");
    } else {
        console.log("Found data: ");
        //TODO: trailing, custom table
        console.table(dataSet.data, ["name", "email", "phone", "balance"]);
        console.log(`Showing ${dataSet.matched} of ${dataSet.total}`);
    }
} 