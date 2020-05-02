
export const nodes = [
    { id: "carlos", label: "Carlos Kelkboom" },
    {
        id: "married", label: "Married?", type: "choice", nodes: [
            {
                id: "femke", label: "Femke Snieders", in: "Spouses", value: true, nodes: [
                    { id: "robin", label: "Robin Kelkboom", in: "Children" },
                    { id: "sam", label: "Sam Kelkboom", in: "Children" },
                    {
                        id: "lief", label: "Zijn ze lief?", in: "Children", type: "choice", nodes: [
                            { id: "ja", in: "Children", label: "Ja" },
                            { id: "nee", in: "Spouses", label: "Nee" },
                        ]
                    },
                ]
            },
            { id: "notMarried", label: "Nope", value: false }
        ]
    },

];


