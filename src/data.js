
export const nodes = [
    { id: "carlos", label: "Carlos Kelkboom" },
    {
        id: "married", label: "Married?", type: "choice", nodes: [
            {
                id: "femke", label: "Femke Snieders", in: "Spouses", value: true, nodes: [
                    { id: "robin", label: "Robin Kelkboom", in: "Children" },
                    { id: "sam", label: "Sam Kelkboom", in: "Children" },
                    {
                        id: "lief", label: "Zijn ze lief?", in: "Calculate", type: "choice", nodes: [
                            { id: "ja", in: "Calculate", label: "Ja" },
                            { id: "nee", in: "Calculate", label: "Nee" },
                        ]
                    },
                ]
            },
            { id: "notMarried", label: "Nope", value: false },
        ]
    },

];


export const getCustomer = [
    { id: "datastore", label: "Database", type: "database" },
    { id: "process1", label: "My Process", in: "Integration", type: "subprocess" },
];