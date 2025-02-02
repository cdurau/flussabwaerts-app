import { useState, useEffect } from "react";
import { openDB } from "idb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface Topic {
    id: number;
    name: string;
    details: string[];
    expanded?: boolean;
}

const DB_NAME = "flowProcessDB";
const STORE_NAME = "topics";

export default function App() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [newTopic, setNewTopic] = useState<string>("");
    const [activeTopic, setActiveTopic] = useState<number | null>(null);

    useEffect(() => {
        const fetchTopics = async () => {
            const db = await openDB(DB_NAME, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                    }
                },
            });
            const allTopics = await db.getAll(STORE_NAME);
            setTopics(allTopics.sort((a, b) => b.id - a.id));
        };
        fetchTopics();
    }, []);

    const addTopic = async (): Promise<void> => {
        if (newTopic.trim() !== "") {
            const db = await openDB(DB_NAME, 1);
            const id = Date.now();
            const newTopicObj: Topic = { id, name: newTopic, details: [], expanded: true };
            await db.add(STORE_NAME, newTopicObj);
            setTopics([newTopicObj, ...topics.map(t => ({ ...t, expanded: false }))]);
            setActiveTopic(id);
            setNewTopic("");
        }
    };

    const addDetail = async (topicId: number, detail: string): Promise<void> => {
        if (detail.trim() !== "") {
            const db = await openDB(DB_NAME, 1);
            const topic = await db.get(STORE_NAME, topicId);
            topic.details.push(detail);
            await db.put(STORE_NAME, topic);
            setTopics(topics.map(t => t.id === topicId ? topic : t));
        }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white text-black p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Flussabwärts-Prozess</h1>
                <div className="flex gap-2 mb-6">
                    <Input
                        className="bg-gray-200 text-black flex-grow"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Neues Thema eingeben"
                        onKeyDown={(e) => e.key === "Enter" && addTopic()}
                    />
                    <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={addTopic}>Hinzufügen</Button>
                </div>
                <div className="space-y-4">
                    {topics.map((topic) => (
                        <motion.div key={topic.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card className="bg-gray-100 text-black shadow-lg border-l-8 border-yellow-400">
                                <CardContent className="p-4">
                                    <h2 className="text-xl font-semibold mb-2 text-blue-600 cursor-pointer" onClick={() => setActiveTopic(topic.id)}>
                                        {topic.name}
                                    </h2>
                                    {activeTopic === topic.id && (
                                        <>
                                            <div className="flex gap-2 mb-2">
                                                <Textarea
                                                    className="bg-white text-black w-full"
                                                    placeholder="Neuer Punkt"
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            addDetail(topic.id, e.currentTarget.value);
                                                            e.currentTarget.value = "";
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <ul className="list-disc pl-5 space-y-1 text-black">
                                                {topic.details.map((detail, i) => (
                                                    <li key={i} className="text-gray-700">{detail}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
