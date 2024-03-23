import { Bus } from "../models/busModel.js";

export const insertDummy = async (req, res) => {
    try {
        // Dummy data
        const dummyBusData = [
            {
                stopName: 'Ponlait 1',
                timings: {
                    towardSJ: ['9:10 AM', '9:35 PM', '10:35 PM', '12:40 PM', '1:30 PM'],
                    towardLibrary: ['11:10AM', '12:05 PM', '1:33 PM', '3:00 PM'],
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
            return res.status(404).json({ error: 'Stoppage not found' });
        }
    } catch (error) {
        console.error('Error fetching bus timings:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
