import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface Details {
    [key: string]: string[];
}

export default function App() {
    const [topics, setTopics] = useState<string[]>([]);
    const [newTopic, setNewTopic] = useState<string>("");
    const [details, setDetails] = useState<Details>({});

    const addTopic = (): void => {
        if (newTopic.trim() !== "") {
            setTopics([newTopic, ...topics]);
            setDetails({ ...details, [newTopic]: [] });
            setNewTopic("");
        }
    };

    const addDetail = (topic: string, detail: string): void => {
        if (detail.trim() !== "") {
            setDetails((prevDetails) => ({
                ...prevDetails,
                [topic]: [...(prevDetails[topic] || []), detail],
            }));
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 min-h-screen text-white">
            <h1 className="text-3xl font-bold text-center mb-6">Flussabwärts-Prozess</h1>
            <div className="flex gap-2 mb-6">
                <Input
                    className="bg-white text-black"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Neues Thema eingeben"
                    onKeyDown={(e) => e.key === "Enter" && addTopic()}
                />
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={addTopic}>Hinzufügen</Button>
            </div>
            <div className="space-y-4">
                {topics.map((topic, index) => (
                    <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Card className="bg-white text-black shadow-lg border-l-8 border-yellow-400">
                            <CardContent className="p-4">
                                <h2 className="text-xl font-semibold mb-2 text-blue-600">{topic}</h2>
                                <div className="flex gap-2 mb-2">
                                    <Textarea
                                        className="bg-gray-200 text-black"
                                        placeholder="Neuer Punkt"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                addDetail(topic, e.currentTarget.value);
                                                e.currentTarget.value = "";
                                            }
                                        }}
                                    />
                                </div>
                                <ul className="list-disc pl-5 space-y-1 text-black">
                                    {details[topic]?.map((detail, i) => (
                                        <li key={i} className="text-gray-700">{detail}</li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
