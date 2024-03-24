import { Bus } from "../models/busModel.js";

export const insertDummy = async (req, res) => {
    try {
        // Dummy data
        const dummyBusData = [
            {
                stopName: 'UMISARC',
                timings: {
                    towardSJ: ['9:44 AM', '10:14 PM', '12:59 PM', '1:29 PM', '1:59 PM,4:59 PM,5:29 PM'],
                    towardLibrary: ['9:31 AM', '09:50 AM', '12:38 PM', '1:05 PM', '01:38 PM', '4:21 PM', '04:51 PM'],
                },
            },
            // Add more dummy data as needed
        ];

        // Insert dummy data into the Bus collection
        await Bus.insertMany(dummyBusData);

        return res.status(200).json({ message: 'Dummy data inserted successfully' });
    } catch (error) {
        console.error('Error inserting dummy data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


export const getBusTimings = async (req, res) => {
    try {
        const { stoppage } = req.body;

        console.log(stoppage)
        if (!stoppage || stoppage === "") {
            return res.status(400).json({ message: 'Please Select Bus Stoppage' });
        }

        // Find bus timings based on stoppage and direction with case-insensitive comparison
        const result = await Bus.findOne({
            "stopName": { $regex: new RegExp(stoppage, 'i') },
        });

        if (result) {
            let response = {

                towardSJ: result.timings.towardSJ,
                towardLibrary: result.timings.towardLibrary
            };
            return res.status(200).json(response);
        } else {
            console.log('Stoppage not found:', stoppage);
            return res.status(200).json({ message: 'Stoppage not found' });
        }
    } catch (error) {
        console.error('Error fetching bus timings:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
