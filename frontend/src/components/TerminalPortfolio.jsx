import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

I'm a passionate Full Stack Developer and Computer Science student who enjoys building meaningful digital experiences.

Currently pursuing my Computer Science degree while working on exciting projects. I love solving real-world problems through code and always eager to learn new technologies!`,

    skills: `💻 Tech Stack I Use:

Frontend:
• React.js, Next.js
• HTML5, CSS3, JavaScript (ES6+)
• Tailwind CSS, Material-UI
• Responsive UI & Accessibility

Backend:
• Node.js, Express.js
• MongoDB, PostgreSQL
• REST APIs, GraphQL
• Authentication & Security

Tools & Others:
• Git & GitHub
• Docker, AWS
• Figma (UI/UX Design)
• Postman, VS Code`,

    projects: `🚀 Featured Projects:

📱 PostX - Social Media App
• MERN stack social platform
• Real-time messaging & notifications
• Image uploads & user profiles

📖 Study Tracker
• Student progress tracking app
• Course management & scheduling
• Grade analytics & insights

📊 Campus Dashboard
• University data visualization
• Student performance metrics
• React + D3.js charts

🧾 Resume Builder
• Professional resume generator
• Multiple templates & PDF export
• Real-time preview & editing

💻 Portfolio Terminal
• This interactive terminal interface
• React + Framer Motion animations`,

    contact: `📬 Get In Touch:

• Email: yash.gandhi@university.edu
• GitHub: github.com/yashgandhi-dev
• LinkedIn: linkedin.com/in/yashgandhi-cs
• University: Computer Science Dept.

💡 Open to internships, collaborations, and tech discussions. Let's connect!`,

    date: new Date().toString()
};

const TerminalPortfolio = () => {
    const [history, setHistory] = useState([initialMessage]);
    const [input, setInput] = useState("");
    const [clearing, setClearing] = useState(false);
    const terminalEndRef = useRef(null);
    const idCardRef = useRef(null);
    const typingDelay = 20;

    // Physics state with controlled parameters
    const [physicsState, setPhysicsState] = useState({
        angle: 0,
        velocity: 0,
        isSwinging: false,
        lastTime: 0
    });

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const animationFrameRef = useRef();

    // Physics constants for controlled movement
    const GRAVITY = 0.4; // Reduced gravity for less swing
    const DAMPING = 0.99; // Higher damping for quicker stop
    const LENGTH = 100;
    const MAX_ANGLE = 0.3; // Limit maximum swing angle (in radians)
    const MIN_VELOCITY = 0.001;

    // Mouse tracking for subtle parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            setMousePos({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Physics simulation with controlled motion
    useEffect(() => {
        const updatePhysics = (currentTime) => {
            setPhysicsState(prev => {
                if (!prev.isSwinging && Math.abs(prev.velocity) < MIN_VELOCITY) {
                    return prev;
                }

                const deltaTime = currentTime - prev.lastTime;
                const normalizedDelta = Math.min(deltaTime / 16, 1);

                // Pendulum physics with angle limiting
                const acceleration = -(GRAVITY / LENGTH) * Math.sin(prev.angle);
                let newVelocity = (prev.velocity + acceleration * normalizedDelta) * DAMPING;
                let newAngle = prev.angle + newVelocity * normalizedDelta;

                // Apply angle limits
                if (Math.abs(newAngle) > MAX_ANGLE) {
                    newAngle = newAngle > 0 ? MAX_ANGLE : -MAX_ANGLE;
                    newVelocity = 0; // Stop at max angle
                }

                // Stop swinging when velocity is very small
                const shouldStop = Math.abs(newVelocity) < MIN_VELOCITY && Math.abs(newAngle) < 0.01;

                return {
                    angle: shouldStop ? 0 : newAngle,
                    velocity: shouldStop ? 0 : newVelocity,
                    isSwinging: !shouldStop,
                    lastTime: currentTime
                };
            });

            if (physicsState.isSwinging || Math.abs(physicsState.velocity) >= MIN_VELOCITY) {
                animationFrameRef.current = requestAnimationFrame(updatePhysics);
            }
        };

        if (physicsState.isSwinging) {
            animationFrameRef.current = requestAnimationFrame(updatePhysics);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [physicsState.isSwinging]);

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

    // Trigger controlled swing
    const swingCard = (impulse = 1) => {
        const currentTime = performance.now();
        setPhysicsState(prev => ({
            ...prev,
            velocity: prev.velocity + (impulse * 0.1 * (Math.random() > 0.5 ? 1 : -1)),
            isSwinging: true,
            lastTime: currentTime
        }));
    };

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    useEffect(() => {
        // Gentle initial swing after load
        const timer = setTimeout(() => swingCard(0.5), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Calculate dynamic shadow based on angle
    const calculateShadow = (angle) => {
        const shadowX = Math.sin(angle) * 10;
        const shadowY = Math.abs(Math.cos(angle)) * 5 + 10;
        const blur = Math.abs(angle) * 3 + 15;
        return `${shadowX}px ${shadowY}px ${blur}px rgba(0,0,0,0.3)`;
    };

    const cardRotation = physicsState.angle * (180 / Math.PI);
    const cardShadow = calculateShadow(physicsState.angle);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-green-400 font-mono p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 overflow-hidden">
            {/* ID Card with Static Lanyard */}
            <div
                className="w-full md:w-2/5 relative flex flex-col items-center mx-auto md:mx-0 select-none cursor-pointer"
                onClick={() => swingCard(1.2)}
                style={{ perspective: '1000px' }}
            >
                {/* Ceiling Hook */}
                <div className="w-10 h-10 bg-slate-700 rounded-full mb-1 shadow-lg flex items-center justify-center z-10">
                    <div className="w-6 h-6 bg-slate-600 rounded-full shadow-inner"></div>
                </div>

                {/* Static Lanyard Rod (no animation) */}
                <div
                    style={{
                        width: '14px',
                        height: '80px',
                        background: 'linear-gradient(to bottom, #e53e3e, #b91c1c)',
                        transformOrigin: 'top center',
                        boxShadow: 'inset 1px 0 3px rgba(255,255,255,0.2), inset -1px 0 3px rgba(0,0,0,0.3)',
                        borderRadius: '0 0 4px 4px',
                        zIndex: 10
                    }}
                    className="origin-top"
                >
                    {/* Lanyard texture */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                {/* Lanyard Clip */}
                <div className="w-16 h-8 bg-gradient-to-b from-slate-600 to-slate-800 rounded-lg -mt-1 shadow-md relative border border-slate-500">
                    <div className="absolute inset-1 bg-gradient-to-b from-slate-500 to-slate-700 rounded-sm"></div>
                </div>

                {/* ID Card */}
                <motion.div
                    ref={idCardRef}
                    className="w-64 h-96 bg-white rounded-xl origin-top flex flex-col items-center justify-start overflow-hidden relative"
                    animate={{
                        rotateZ: cardRotation,
                        rotateX: mousePos.y * 2,
                        rotateY: mousePos.x * 2,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 25,
                        mass: 0.8
                    }}
                    style={{
                        boxShadow: cardShadow,
                        background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                        border: '3px solid #e2e8f0',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                    }}
                >
                    {/* Card Shine Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                    {/* University Header */}
                    <div className="w-full h-16 bg-gradient-to-r from-blue-700 to-blue-800 flex items-center justify-center relative">
                        <h3 className="text-white font-bold text-sm tracking-wider z-10">UNIVERSITY ID</h3>
                        <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-5 h-5 bg-white/50 rounded-full flex items-center justify-center">
                                <span className="text-blue-800 text-xs font-bold">CSE</span>
                            </div>
                        </div>
                    </div>

                    {/* Student Photo Section */}
                    <div className="flex justify-center mt-4 mb-2 relative">
                        <div className="w-28 h-28 border-3 border-blue-700 rounded-full overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg relative">
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-full">
                                <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full overflow-hidden shadow-inner">
                                    <img
                                        src="/avtarImage.JPG"
                                        alt="Yash Gandhi"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3Ctext x='50%' y='50%' font-size='40' text-anchor='middle' dominant-baseline='middle' fill='%23666'%3E🎓%3C/text%3E%3C/svg%3E"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student Information */}
                    <div className="px-4 pb-4 text-center text-gray-800 w-full">
                        <h2 className="text-2xl font-bold mb-1 text-gray-900">Yash Gandhi</h2>
                        <p className="text-xs font-semibold text-blue-800 mb-1">COMPUTER SCIENCE & ENGINEERING</p>
                        <p className="text-xs text-gray-600 mb-4">Class of 2025</p>

                        {/* Student Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                            <div className="text-left">
                                <p className="font-semibold text-gray-700">Enrollment No:</p>
                                <p className="text-gray-600">2301201713</p>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-700">Status:</p>
                                <p className="text-green-600 font-semibold">ACTIVE</p>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-700">GPA:</p>
                                <p className="text-gray-600">8.13/10</p>
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-700">Expires:</p>
                                <p className="text-gray-600">May 2027</p>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="mt-2 h-12 w-full bg-white border border-gray-300 rounded flex items-center justify-center overflow-hidden px-2">
                            <div className="flex h-full items-center w-full justify-center">
                                {[...Array(50)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="bg-black mr-0.5"
                                        style={{
                                            width: `${Math.random() > 0.6 ? 2 : 1}px`,
                                            height: `${Math.random() > 0.2 ? Math.random() * 70 + 30 : 10}%`,
                                            backgroundColor: i % 8 === 0 ? '#1f2937' : '#000'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className="mt-3 pt-2 border-t border-gray-300 text-xs">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-gray-600">VALID STUDENT</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Terminal Section */}
            <div className="w-full md:w-3/5 bg-zinc-900 p-4 rounded-lg shadow-inner min-h-[80vh] font-mono overflow-hidden border border-gray-700">
                <style>
                    {`
                        @keyframes blinkCursor {
                          0%, 49% { opacity: 1; }
                          50%, 100% { opacity: 0; }
                        }
                        .blink-fast {
                          animation: blinkCursor 0.7s step-end infinite;
                        }
                        .scrollbar-green::-webkit-scrollbar {
                          height: 6px;
                          width: 8px;
                        }
                        .scrollbar-green::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .scrollbar-green::-webkit-scrollbar-thumb {
                          background-color: #22c55e;
                          border-radius: 10px;
                        }
                    `}
                </style>

                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-lg text-green-300">~ Yash Terminal Portfolio</h1>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                </div>

                {/* Terminal Output */}
                <div className="flex-1 overflow-auto pr-2 scrollbar-green" style={{ maxHeight: "calc(80vh - 80px)" }}>
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
                                            <span className="text-green-500">Yash@portfolio</span>
                                            <span className="text-blue-400">:~</span>
                                            <span className="text-green-400">$ </span>
                                            <span className="text-green-200">{entry.cmd}</span>
                                        </p>
                                    )}
                                    <pre className="whitespace-pre-wrap text-green-300 bg-zinc-800/60 border-l-4 border-green-400 pl-3 pr-2 py-2 my-2 rounded-md">
                                        {entry.output}
                                    </pre>
                                </motion.div>
                            ))}
                    </AnimatePresence>
                    <div ref={terminalEndRef} />
                </div>

                {/* Terminal Input */}
                <div className="flex items-center mt-2 relative overflow-x-auto scrollbar-green">
                    <span className="text-green-500 shrink-0">student@portfolio</span>
                    <span className="text-blue-400 shrink-0">:~</span>
                    <span className="text-green-400 shrink-0">$ </span>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            className="absolute inset-0 w-full h-full bg-transparent text-green-200 outline-none border-none caret-transparent"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <span className="text-green-200">
                            {input}
                            <span className="bg-green-400 ml-[1px] w-[8px] h-[18px] inline-block align-middle blink-fast"></span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminalPortfolio;