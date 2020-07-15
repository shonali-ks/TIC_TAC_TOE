if (this.type === 'max') {
    let maxScore = -1000;
    let maxIndex = 0;

    for (let i = 0; i < this.data.length; i++) {
        const d = this.data[i];
        const childNode = new Node(d, changeType(this.type), this.depth + 1, this.alpha, this.beta);
        const childScore = childNode.score();
        // console.log(childScore);

        if (childScore > maxScore) {
            maxScore = childScore;
            maxIndex = i;
            this.alpha = maxScore;
        }

        if (this.alpha >= this.beta) {
            break;
        }
    }

    return maxScore;
}

else if (this.type === 'min') {
    let minScore = 1000;
    let minIndex = 0;

    for (let i = 0; i < this.data.length; i++) {
        const d = this.data[i];
        const childNode = new Node(d, changeType(this.type), this.depth + 1, this.alpha, this.beta);
        const childScore = childNode.score();
        // console.log(childScore);

        if (childScore < minScore) {
            minScore = childScore;
            minIndex = i;
            this.beta = minScore;
        }

        if (this.alpha >= this.beta) {
            break;
        }
    }


    return minScore;
}
}
}
