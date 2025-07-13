import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const initialMessage = {
    cmd: "",
    output: "Welcome to Yash Gandhi's Portfolio Terminal.\nType \"help\" to see available commands.\n"
};

const themes = {
    default: {
        name: "Default",
        bg: "bg-gradient-to-br from-gray-900 to-black",
        text: "text-green-400",
        terminalBg: "bg-zinc-900",
        terminalBorder: "border-gray-700",
        prompt: {
            user: "text-green-500",
            symbol: "text-blue-400",
            cursor: "text-green-400",
            input: "text-green-200"
        },
        output: {
            bg: "bg-zinc-800/60",
            border: "border-green-400",
            text: "text-green-300"
        }
    },
    hacker: {
        name: "90s Hacker",
        bg: "bg-gradient-to-br from-[#000000] to-[#0a0f0a]",
        text: "text-[#39ff14]",
        terminalBg: "bg-[#0b0f0b]/95",
        terminalBorder: "border-[#00ff00]/20",
        prompt: {
            user: "text-[#ff4d4d]",
            symbol: "text-[#00cc00]",
            cursor: "text-[#39ff14]",
            input: "text-[#a0ffb0]"
        },
        output: {
            bg: "bg-[#0e0f0e]/85",
            border: "border-[#ff4d4d]/40",
            text: "text-[#7fffd4]"
        },
        highlight: "text-[#ff6666]",
        accent: "bg-[#ff4d4d]/10"
    },
    toxicgreenwave: {
        name: "Toxic Greenwave",
        bg: "bg-gradient-to-br from-[#020c02] to-[#0a1400]",
        text: "text-[#ccff00]", // toxic yellow-green
        terminalBg: "bg-[#0b1200]/90",
        terminalBorder: "border-[#aaff00]/30",
        prompt: {
            user: "text-[#99ff00]",    // electric green
            symbol: "text-[#ccff33]",  // hacker neon
            cursor: "text-[#dfff66]",  // brighter glow
            input: "text-[#f0ffc0]"    // light toxic input
        },
        output: {
            bg: "bg-[#131a00]/80",
            border: "border-[#99ff00]/30",
            text: "text-[#eaff9d]"
        },
        highlight: "text-[#ccff33]",
        accent: "bg-[#ccff00]/10"
    },
    matrix: {
        name: "Digital Rain",
        bg: "bg-gradient-to-br from-black to-green-950",
        text: "text-emerald-400",
        terminalBg: "bg-black/95",
        terminalBorder: "border-emerald-800",
        prompt: {
            user: "text-emerald-500",
            symbol: "text-green-800",
            cursor: "text-emerald-400",
            input: "text-emerald-300"
        },
        output: {
            bg: "bg-gray-900/60",
            border: "border-emerald-700",
            text: "text-emerald-300"
        },
        highlight: "text-emerald-400",
        accent: "bg-emerald-500/10"
    },
    dracula: {
        name: "Dracula Pro",
        bg: "bg-gradient-to-br from-purple-950 to-gray-950",
        text: "text-pink-200",
        terminalBg: "bg-gray-900/95",
        terminalBorder: "border-purple-700",
        prompt: {
            user: "text-purple-400",
            symbol: "text-pink-500",
            cursor: "text-pink-300",
            input: "text-pink-200"
        },
        output: {
            bg: "bg-gray-800/70",
            border: "border-purple-500",
            text: "text-pink-200"
        },
        highlight: "text-purple-300",
        accent: "bg-purple-500/15"
    },
    solarized: {
        name: "Solarized Dark",
        bg: "bg-gradient-to-br from-slate-900 to-slate-950",
        text: "text-amber-200",
        terminalBg: "bg-slate-800/90",
        terminalBorder: "border-amber-700/50",
        prompt: {
            user: "text-cyan-400",
            symbol: "text-amber-600",
            cursor: "text-amber-300",
            input: "text-amber-200"
        },
        output: {
            bg: "bg-slate-700/60",
            border: "border-amber-600/50",
            text: "text-amber-100"
        },
        highlight: "text-cyan-300",
        accent: "bg-amber-500/10"
    },
    nord: {
        name: "Nord Frost",
        bg: "bg-gradient-to-br from-gray-900 to-blue-950",
        text: "text-blue-100",
        terminalBg: "bg-gray-800/95",
        terminalBorder: "border-blue-600/50",
        prompt: {
            user: "text-blue-400",
            symbol: "text-cyan-500",
            cursor: "text-blue-300",
            input: "text-blue-200"
        },
        output: {
            bg: "bg-gray-700/70",
            border: "border-cyan-500/50",
            text: "text-blue-100"
        },
        highlight: "text-cyan-300",
        accent: "bg-cyan-500/10"
    },
    monokai: {
        name: "Monokai Pro",
        bg: "bg-gradient-to-br from-gray-950 to-gray-900",
        text: "text-yellow-200",
        terminalBg: "bg-gray-900/95",
        terminalBorder: "border-purple-600",
        prompt: {
            user: "text-pink-400",
            symbol: "text-yellow-600",
            cursor: "text-yellow-300",
            input: "text-yellow-200"
        },
        output: {
            bg: "bg-gray-800/70",
            border: "border-pink-500",
            text: "text-yellow-100"
        },
        highlight: "text-pink-300",
        accent: "bg-pink-500/10"
    },
    gruvbox: {
        name: "Gruvbox Dark",
        bg: "bg-gradient-to-br from-stone-900 to-amber-950",
        text: "text-amber-200",
        terminalBg: "bg-stone-800/95",
        terminalBorder: "border-amber-700/50",
        prompt: {
            user: "text-green-500",
            symbol: "text-amber-600",
            cursor: "text-amber-400",
            input: "text-amber-300"
        },
        output: {
            bg: "bg-stone-700/70",
            border: "border-green-600/50",
            text: "text-amber-200"
        },
        highlight: "text-green-400",
        accent: "bg-green-500/10"
    },
    cyberbloom: {
        name: "Cyber Bloom",
        bg: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]",
        text: "text-pink-200",
        terminalBg: "bg-[#1c1c3c]/95",
        terminalBorder: "border-[#ff00c8]/30",
        prompt: {
            user: "text-[#ffd700]",
            symbol: "text-[#00ffff]",
            cursor: "text-[#ff4ff8]",
            input: "text-[#ffe6fb]"
        },
        output: {
            bg: "bg-[#1f1a3c]/80",
            border: "border-[#ff4ff8]/30",
            text: "text-[#ffcaf7]"
        },
        highlight: "text-[#00ffff]",
        accent: "bg-[#00ffff]/10"
    },
    neonwave: {
        name: "Neon Wave",
        bg: "bg-gradient-to-br from-black to-fuchsia-900",
        text: "text-fuchsia-200",
        terminalBg: "bg-black/90",
        terminalBorder: "border-cyan-500",
        prompt: {
            user: "text-cyan-300",
            symbol: "text-pink-500",
            cursor: "text-fuchsia-400",
            input: "text-fuchsia-200"
        },
        output: {
            bg: "bg-gray-800/70",
            border: "border-pink-400",
            text: "text-fuchsia-300"
        },
        highlight: "text-pink-300",
        accent: "bg-pink-600/10"
    }
};
const commands = {
  help: `📖 Available Commands:

• about       → Know more about me
• skills      → See my tech stack
• projects    → Explore my featured projects
• contact     → How to get in touch
• clear       → Clear the terminal
• echo [text] → Repeat your text
• date        → Show current date & time
• theme       → Change terminal theme (use: theme set [name])
• themes      → List available themes
• ascii       → Show a fun ASCII art`,

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

  date: new Date().toString(),

  themes: `🎨 Available Themes:

${Object.entries(themes).map(([key, theme]) => `• ${key} - ${theme.name}`).join('\n')}

💡 Use "theme set [name]" to change theme`,

  ascii: `
⊂(◉‿◉)つ

YASH GANDHI
`
};

const TerminalPortfolio = () => {
    const [history, setHistory] = useState([initialMessage]);
    const [input, setInput] = useState("");
    const [clearing, setClearing] = useState(false);
    const [currentTheme, setCurrentTheme] = useState("default");
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

        if (lower.startsWith("theme set ")) {
            const themeName = trimmed.slice(10).toLowerCase();
            if (themes[themeName]) {
                setCurrentTheme(themeName);
                setHistory((prev) => [...prev, { cmd: trimmed, output: "" }]);
                await simulateTyping(`Theme changed to ${themes[themeName].name}`);
            } else {
                setHistory((prev) => [...prev, { cmd: trimmed, output: "" }]);
                await simulateTyping(`❌ Theme "${themeName}" not found. Type "themes" to see available themes.`);
            }
            return;
        }

        if (lower === "theme" || lower === "themes") {
            setHistory((prev) => [...prev, { cmd: trimmed, output: "" }]);
            await simulateTyping(commands.themes);
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

    const theme = themes[currentTheme];

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text} font-mono p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 overflow-hidden`}>
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
            <div className={`w-full md:w-3/5 ${theme.terminalBg} p-4 rounded-lg shadow-inner min-h-[80vh] font-mono overflow-hidden border ${theme.terminalBorder}`}>
                <style>
                    {`
                        @keyframes blinkCursor {
                          0%, 49% { opacity: 1; }
                          50%, 100% { opacity: 0; }
                        }
                        .blink-fast {
                          animation: blinkCursor 0.7s step-end infinite;
                        }
                        .scrollbar-custom::-webkit-scrollbar {
                          height: 6px;
                          width: 8px;
                        }
                        .scrollbar-custom::-webkit-scrollbar-track {
                          background: transparent;
                        }
                        .scrollbar-custom::-webkit-scrollbar-thumb {
                          background-color: ${theme.output.border.replace('border-', '').split('-')[0]}-500;
                          border-radius: 10px;
                        }
                    `}
                </style>

                <div className="flex items-center justify-between mb-2">
                    <h1 className={`text-lg ${theme.prompt.user}`}>~ Yash Terminal Portfolio</h1>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                </div>

                {/* Terminal Output */}
                <div className="flex-1 overflow-auto pr-2 scrollbar-custom" style={{ maxHeight: "calc(80vh - 80px)" }}>
                    <AnimatePresence>
                        {!clearing &&
                            history.map((entry, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-auto scrollbar-custom"
                                >
                                    {entry.cmd && (
                                        <p className={`${theme.text} overflow-x-auto scrollbar-custom`}>
                                            <span className={theme.prompt.user}>Yash@portfolio</span>
                                            <span className={theme.prompt.symbol}>:~</span>
                                            <span className={theme.prompt.cursor}>$ </span>
                                            <span className={theme.prompt.input}>{entry.cmd}</span>
                                        </p>
                                    )}
                                    <pre className={`whitespace-pre-wrap ${theme.output.text} ${theme.output.bg} border-l-4 ${theme.output.border} pl-3 pr-2 py-2 my-2 rounded-md`}>
                                        {entry.output}
                                    </pre>
                                </motion.div>
                            ))}
                    </AnimatePresence>
                    <div ref={terminalEndRef} />
                </div>

                {/* Terminal Input */}
                <div className="flex items-center mt-2 relative overflow-x-auto scrollbar-custom">
                    <span className={`${theme.prompt.user} shrink-0`}>student@portfolio</span>
                    <span className={`${theme.prompt.symbol} shrink-0`}>:~</span>
                    <span className={`${theme.prompt.cursor} shrink-0`}>$ </span>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            className="absolute inset-0 w-full h-full bg-transparent outline-none border-none caret-transparent"
                            style={{ color: theme.prompt.input.replace('text-', '') }}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                        <span className={theme.prompt.input}>
                            {input}
                            <span className={`ml-[1px] w-[8px] h-[18px] inline-block align-middle blink-fast`}
                                style={{ backgroundColor: theme.prompt.cursor.replace('text-', '').split('-')[0] }}></span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminalPortfolio;
