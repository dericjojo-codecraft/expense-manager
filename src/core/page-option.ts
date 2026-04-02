
export interface PageOptions {offset:number,limit:number}

export interface PageResult<T>{
    data:T[];
    matched:number;
    total:number;
}

// function that takes an array of T and returns nothing
export default function displayTable<T>(dataSet: T[]) {
    if(dataSet.length === 0) {
        console.log("No data available");
    } else {
        console.table(dataSet);
    }
} 