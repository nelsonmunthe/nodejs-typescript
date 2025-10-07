const numbers = [1,99,100,2,5,3,7,88,101];

const merge = (left, right) => {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;
    while(leftIndex < right.length && rightIndex < right.length) {
        if(left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex])
            leftIndex++
        } else {
            result.push(right[rightIndex])
            rightIndex++
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex))
}

const mergeSort = (numbers) => {

    if(numbers.length <= 1) return numbers
    const middleIndex = Math.floor(numbers.length / 2)
    const leftSide = numbers.slice(0, middleIndex)
    const rightSide = numbers.slice(middleIndex)
    
    return merge(
        mergeSort(leftSide),
        mergeSort(rightSide)
    )
}

const sortedNumber = mergeSort(numbers);
console.log("sortedNumber", sortedNumber)
// linear, binary sort.
// bubble, selection, merge, insertion etc.


const binarySearch = (sortedNumber, target) => {
    if(sortedNumber.length === 1 && sortedNumber[0] !== target) return 'target not found'
    if(sortedNumber.length === 1 && sortedNumber[0] === target) return target

    const middleIndex = Math.floor(sortedNumber.length / 2);
    const middelValue = sortedNumber[middleIndex];

    if(target === middelValue) {
        return target
    } else if(target < middelValue) {
        return binarySearch(sortedNumber.slice(0, middleIndex), target)
    } else {
        return binarySearch(sortedNumber.slice(middleIndex), target)
    }
}

console.log("binarySearch", binarySearch(sortedNumber, 1))

const bubbleSort = (number) => {
    for(let i=0; i < number.length; i++) {
        for(let j=i + 1; j < number.length; j++) {
            if(number[i] > number[j]) {
                [number[i], number[j]] = [number[j], number[i]]
            }
        }
    }

    return number
}

console.log("bublleSort", bubbleSort(numbers))