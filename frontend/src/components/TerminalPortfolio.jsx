// TerminalPortfolio.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated, config } from "@react-spring/web";

const avatarURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Sample_User_Icon.png/480px-Sample_User_Icon.png";

const initialMessage = {
    cmd: "",
    output: "Welcome to Yash Gandhi's Portfolio Terminal.\nType \"help\" to see available commands.\n"
};

const commands = {
    help: `📖 Available Commands:

• about       → Know more about me
• skills      → See my tech stack
• projects    → Explore my featured projects
• contact     → How to get in touch
• clear       → Clear the terminal
• echo [text] → Repeat your text
• date        → Show current date & time`,

    about: `👋 Hey, I'm Yash Gandhi.

I'm a passionate Full Stack Developer who enjoys building meaningful digital experiences.

With a strong web foundation, I create apps that are scalable, responsive, and accessible — from frontend interfaces to backend APIs. I love solving real-world problems through code!`,

    skills: `💻 Tech Stack I Use:

Frontend:
• React.js
• HTML5, CSS3, JavaScript (ES6+)
• Tailwind CSS
• Responsive UI & Accessibility

Backend:
• Node.js, Express.js
• MongoDB (via Mongoose)
• REST APIs, Auth (JWT/OAuth)

Tools:
• Git & GitHub
• Figma (UI/UX)
• Firebase, Netlify, Vercel
• Postman, Vite, ESLint, Prettier`,

    projects: `🚀 Featured Projects:

📱 PostX
• MERN social app for sharing posts
• Real-time like/edit, profile feed, uploads

📖 Shikshapatri Tracker
• MERN-based app to track daily spiritual reading
• Includes Gujarati TTS & PDF sync

📊 Mutual Fund Dashboard
• React + Recharts-based fund tracker
• Live NAVs, charts, holdings — made for clients/distributors

🧾 Resume Builder
• Resume builder with live preview templates
• Export clean styled PDFs

💻 Portfolio Terminal
• This very terminal-based portfolio using React + Tailwind!`,

    contact: `📬 Get In Touch:

• Email: yashgandhi.dev@gmail.com
• GitHub: github.com/yashgandhi
• LinkedIn: linkedin.com/in/yashgandhi

💡 Open to collaboration, freelance, internships, or a tech conversation. Reach out!`,

    date: new Date().toString()
};



const TerminalPortfolio = () => {
    const [history, setHistory] = useState([initialMessage]);
    const [input, setInput] = useState("");
    const [clearing, setClearing] = useState(false);
    const terminalEndRef = useRef(null);
    const idCardRef = useRef(null);
    const typingDelay = 20;

    const [{ x, rotateZ, rotateY, rotateX, scale }, api] = useSpring(() => ({
        x: 0,
        rotateZ: 0,
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        config: config.default
    }));

    const simulateTyping = async (text) => {
        let displayed = "";
        for (let i = 0; i < text.length; i++) {
            displayed += text[i];
            await new Promise((res) => setTimeout(res, typingDelay));
            setHistory((prev) => {
                const updated = [...prev];
                updated[updated.length - 1].output = displayed;
                return [...updated];
            });
        }
    };

    const handleCommand = async (cmd) => {
        const trimmed = cmd.trim();
        const lower = trimmed.toLowerCase();

        if (lower === "clear") {
            setClearing(true);
            setTimeout(() => {
                setHistory([initialMessage]);
                setClearing(false);
            }, 500);
            return;
        }

        if (lower.startsWith("echo ")) {
            const echoText = trimmed.slice(5);
            setHistory((prev) => [...prev, { cmd: trimmed, output: "" }]);
            await simulateTyping(echoText);
            return;
        }

        const output = commands[lower] || `❌ Command not found: ${trimmed}\nType \"help\" to see available commands.`;
        setHistory((prev) => [...prev, { cmd: trimmed, output: "" }]);
        await simulateTyping(output);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            handleCommand(input);
            setInput("");
        }
    };

    const swing = (impulse = 1) => {
        api.start({
            to: async (next) => {
                await next({ x: 15 * impulse, rotateZ: 12, rotateY: 10, rotateX: 8, scale: 1.03 });
                await next({ x: -10 * impulse, rotateZ: -10, rotateY: -8, rotateX: -6, scale: 1 });
                await next({ x: 6 * impulse, rotateZ: 6, rotateY: 4, rotateX: 4 });
                await next({ x: -3 * impulse, rotateZ: -3, rotateY: -2, rotateX: -2 });
                await next({ x: 1, rotateZ: 1, rotateY: 1, rotateX: 0.5 });
                await next({ x: 0, rotateZ: 0, rotateY: 0, rotateX: 0, scale: 1 });
            }
        });
    };

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    useEffect(() => {
        swing(0.9);
    }, []);

    useEffect(() => {
        const handleOrientation = (event) => {
            const { beta, gamma } = event;
            if (window.innerWidth <= 768) {
                api.start({
                    rotateX: beta / 4,
                    rotateY: gamma / 4
                });
            }
        };
        window.addEventListener("deviceorientation", handleOrientation);
        return () => window.removeEventListener("deviceorientation", handleOrientation);
    }, [api]);

    return (
        <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col md:flex-row items-start gap-6 md:gap-10 overflow-hidden">
            <div className="w-full md:w-2/5 relative flex flex-col items-center mx-auto md:mx-0 mt-4 md:mt-0 select-none cursor-pointer" onClick={() => swing(1.2)}>
                <div className="w-6 h-6 rounded-full bg-gray-700 mb-1 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mb-1"></div>
                    <div className="w-4 h-4 bg-gray-400 rounded-full mb-1"></div>
                </div>
                <animated.div
                    style={{ transform: x.to((v) => `translateX(${v}px)`), width: '3px', height: '70px' }}
                    className="bg-gradient-to-b from-gray-400 to-gray-600 origin-top rounded-full shadow-md"
                />
                <animated.div
                    className="w-5 h-5 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full -mt-2 z-10 shadow-lg border border-white"
                    style={{ transform: x.to((v) => `translateX(${v}px)`) }}
                />
                <animated.div
                    ref={idCardRef}
                    className="w-60 h-90 bg-white bg-opacity-90 border border-gray-400 rounded-lg origin-top mt-2 flex flex-col items-center justify-start overflow-hidden shadow-2xl relative backdrop-blur-md"
                    style={{
                        transform: x.to(
                            (v) => `translateX(${v}px) rotateZ(${rotateZ.get()}deg) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg) scale(${scale.get()})`
                        )
                    }}
                >

                    <div className="flex justify-center mt-4">
                        <div className="w-30 h-30 border-2 border-blue-600 rounded-full overflow-hidden bg-gray-100 shadow-inner">
                            <img
                                src="/avtarImage.JPG"
                                alt="ID Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    <div className="p-4 text-center text-gray-800">
                        <h2 className="text-lg font-bold">Yash Gandhi</h2>
                        <p className="text-xs mt-1">STUDENT ID</p>
                        <div className="mt-2 text-xs">
                            <p>Computer Science & engineering</p>
                            <p className="mt-1">EnrollMent_No : 2301201713</p>
                        </div>
                        <div className="mt-3 h-8 w-full bg-white border border-gray-300 flex items-center justify-center">
                            <div className="flex h-full items-center">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="h-full w-1 bg-black mr-0.5" style={{ height: `${Math.random() * 80 + 20}%` }} />
                                ))}
                            </div>
                        </div>
                        <div className="mt-2 border-t border-gray-300 pt-1">
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-left">Signature:</p>
                                <div className="h-6 w-24 border-b border-black">
                                    <span className="italic font-[cursive] text-sm tracking-wide">yash</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </animated.div>
            </div>
            <div className="w-full md:w-3/5 bg-zinc-900 p-4 rounded-lg shadow-inner min-h-[80vh] font-mono overflow-hidden">
                <style>
                    {`
      @keyframes blinkCursor {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
      .blink-fast {
        animation: blinkCursor 0.4s step-end infinite;
      }
      .scrollbar-green::-webkit-scrollbar {
        height: 6px;
        width: 8px;
      }
      .scrollbar-green::-webkit-scrollbar-track {
        background: transparent;
      }
      .scrollbar-green::-webkit-scrollbar-thumb {
        background-color: #22c55e; /* Tailwind green-500 */
        border-radius: 10px;
      }
    `}
                </style>

                <h1 className="text-xl mb-2">~ Yash Terminal Portfolio</h1>

                {/* Scrollable terminal history output */}
                <div className="flex-1 overflow-auto pr-2 scrollbar-green" style={{ maxHeight: "calc(80vh - 60px)" }}>
                    <AnimatePresence>
                        {!clearing &&
                            history.map((entry, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-auto scrollbar-green"
                                >
                                    {entry.cmd && (
                                        <p className="text-green-400 overflow-x-auto scrollbar-green">
                                            Yash@portfolio:~/desktop${" "}
                                            <span className="text-green-200">{entry.cmd}</span>
                                        </p>
                                    )}
                                    <pre className="whitespace-pre-wrap text-green-300 bg-zinc-800/60 border-l-4 border-green-400 pl-3 pr-2 py-2 my-2 rounded-md shadow-inner">
                                        {entry.output}
                                    </pre>

                                </motion.div>
                            ))}
                    </AnimatePresence>

                    <div ref={terminalEndRef} />
                </div>

                {/* Terminal input with thick blinking green cursor */}
                <div className="flex items-center mt-2 relative overflow-x-auto scrollbar-green">
                    <span className="text-green-400 shrink-0">Yash@portfolio:~/desktop$&nbsp;</span>

                    <div className="relative flex-1">
                        {/* Hidden input to accept typing */}
                        <input
                            type="text"
                            className="absolute inset-0 w-full h-full bg-transparent text-green-200 outline-none border-none caret-transparent"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />

                        {/* Display typed text with blinking block */}
                        <span className="text-green-200">
                            {input}
                            <span className="bg-green-400 ml-[1px] w-[8px] h-[20px] inline-block align-middle blink-fast"></span>
                        </span>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default TerminalPortfolio;
