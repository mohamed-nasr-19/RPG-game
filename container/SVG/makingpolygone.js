const svg = document.querySelector(".parent-svg");
const polygon = document.querySelector(".mister-polygon");

const numOfSides = 6000;
const radius = 80;

function drawPolygon() {
    const svgWidth = Number(svg.getAttribute("width"));
    const svgHeight = Number(svg.getAttribute("height"));

    const cx = svgWidth / 2;
    const cy = svgHeight / 2;

    const points = [];

    for (let index = 0; index < numOfSides; index++) {

        const rotationOffset =
            numOfSides % 2 === 0
                ? Math.PI / numOfSides
                : 0;

        const angle =
            (index * 2 * Math.PI) / numOfSides
            - Math.PI / 2
            + rotationOffset;

        const x = cx +  radius * Math.cos(angle);
        const y =  cx + radius * Math.sin(angle);

        points.push(`${x},${y}`);
    }

    polygon.setAttribute("points", points.join(" "));
}

drawPolygon();