"use client"

import { useState, useEffect } from "react"
import { RotateCcw, Bot, Users } from "lucide-react"

type Player = "X" | "O"
type Board = (Player | null)[]
type Mode = "menu" | "multiplayer" | "system"

const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
]

function getWinner(board: Board): { winner: Player; line: number[] } | null {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a] as Player, line }
        }
    }
    return null
}

// Minimax AI — always plays optimally as O
function minimax(board: Board, isMaximizing: boolean): number {
    const result = getWinner(board)
    if (result?.winner === "O") return 10
    if (result?.winner === "X") return -10
    if (board.every(Boolean)) return 0

    if (isMaximizing) {
        let best = -Infinity
        board.forEach((cell, i) => {
            if (!cell) {
                board[i] = "O"
                best = Math.max(best, minimax(board, false))
                board[i] = null
            }
        })
        return best
    } else {
        let best = Infinity
        board.forEach((cell, i) => {
            if (!cell) {
                board[i] = "X"
                best = Math.min(best, minimax(board, true))
                board[i] = null
            }
        })
        return best
    }
}

function getBestMove(board: Board): number {
    let bestVal = -Infinity
    let bestMove = -1
    board.forEach((cell, i) => {
        if (!cell) {
            board[i] = "O"
            const val = minimax(board, false)
            board[i] = null
            if (val > bestVal) {
                bestVal = val
                bestMove = i
            }
        }
    })
    return bestMove
}

function ModeMenu({ onSelect }: { onSelect: (m: Mode) => void }) {
    return (
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-5 w-72 animate-fade-in-up">
            <div className="text-center">
                <div className="font-mono text-xs text-terminal-dim mb-1">// tictactoe.exe</div>
                <div className="font-mono text-base text-foreground font-semibold">Select Mode</div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
                <button
                    onClick={() => onSelect("multiplayer")}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/30 p-4 hover:border-primary/40 hover:bg-secondary/60 hover:text-primary transition-all duration-200 group"
                >
                    <Users className="h-6 w-6 text-terminal-cyan group-hover:text-primary transition-colors" />
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">Multiplayer</span>
                    <span className="font-mono text-[10px] text-terminal-dim">P1 vs P2</span>
                </button>

                <button
                    onClick={() => onSelect("system")}
                    className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/30 p-4 hover:border-terminal-cyan/40 hover:bg-secondary/60 transition-all duration-200 group"
                >
                    <Bot className="h-6 w-6 text-primary group-hover:text-terminal-cyan transition-colors" />
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-terminal-cyan transition-colors">vs System</span>
                    <span className="font-mono text-[10px] text-terminal-dim">You vs AI</span>
                </button>
            </div>

            <div className="font-mono text-[10px] text-terminal-dim text-center">
                open a window above to dismiss <span className="text-primary">↑</span>
            </div>
        </div>
    )
}

export function TicTacToe() {
    const [mode, setMode] = useState<Mode>("menu")
    const [board, setBoard] = useState<Board>(Array(9).fill(null))
    const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
    const [isAiThinking, setIsAiThinking] = useState(false)

    const result = getWinner(board)
    const isDraw = !result && board.every(Boolean)
    const gameOver = !!result || isDraw

    // AI move trigger
    useEffect(() => {
        if (mode !== "system" || currentPlayer !== "O" || gameOver) return
        setIsAiThinking(true)
        const timer = setTimeout(() => {
            setBoard((prev) => {
                const next = [...prev]
                const move = getBestMove(next)
                if (move !== -1) next[move] = "O"
                return next
            })
            setCurrentPlayer("X")
            setIsAiThinking(false)
        }, 400) // slight delay so it feels natural
        return () => clearTimeout(timer)
    }, [mode, currentPlayer, gameOver])

    const handleClick = (idx: number) => {
        if (board[idx] || gameOver || isAiThinking) return
        if (mode === "system" && currentPlayer === "O") return
        const next = [...board]
        next[idx] = currentPlayer
        setBoard(next)
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }

    const reset = () => {
        setBoard(Array(9).fill(null))
        setCurrentPlayer("X")
        setIsAiThinking(false)
    }

    const backToMenu = () => {
        reset()
        setMode("menu")
    }

    if (mode === "menu") return <ModeMenu onSelect={setMode} />

    const isSystemMode = mode === "system"

    const statusText = result
        ? isSystemMode
            ? result.winner === "X" ? "✓ You win!" : "✗ System wins!"
            : `${result.winner} wins!`
        : isDraw
            ? "~ draw — try again"
            : isAiThinking
                ? "~ system thinking..."
                : isSystemMode
                    ? currentPlayer === "X" ? "> Your turn" : "> System's turn"
                    : `> ${currentPlayer}'s turn`

    const statusColor = result
        ? result.winner === "X" ? "text-primary" : "text-terminal-cyan"
        : isDraw ? "text-terminal-yellow"
            : isAiThinking ? "text-terminal-dim"
                : currentPlayer === "X" ? "text-primary" : "text-terminal-cyan"

    return (
        <div className="glass rounded-2xl p-6 flex flex-col items-center gap-5 select-none w-72 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs text-terminal-dim">// tictactoe.exe</span>
                        <span className={`font-mono text-[10px] ${isSystemMode ? "text-terminal-cyan" : "text-primary"}`}>
                            [{isSystemMode ? "vs AI" : "2P"}]
                        </span>
                    </div>
                    <span className={`font-mono text-sm font-semibold ${statusColor} transition-colors duration-300`}>
                        {statusText}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="rounded-lg border border-border bg-secondary/50 p-2 text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-secondary transition-all duration-200"
                        title="Reset"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                        onClick={backToMenu}
                        className="rounded-lg border border-border bg-secondary/50 p-2 text-muted-foreground hover:text-terminal-cyan hover:border-terminal-cyan/30 hover:bg-secondary transition-all duration-200"
                        title="Change mode"
                    >
                        {isSystemMode ? <Bot className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="text-primary font-bold">X</span>
                    <span className="text-terminal-dim">= {isSystemMode ? "You" : "Player 1"}</span>
                </div>
                <span className="text-border">|</span>
                <div className="flex items-center gap-1.5">
                    <span className="text-terminal-cyan font-bold">O</span>
                    <span className="text-terminal-dim">= {isSystemMode ? "System" : "Player 2"}</span>
                </div>
            </div>

            {/* Board */}
            <div className="grid grid-cols-3 gap-2">
                {board.map((cell, idx) => {
                    const isWinCell = result?.line.includes(idx)
                    const isClickable = !cell && !gameOver && !isAiThinking && !(isSystemMode && currentPlayer === "O")
                    return (
                        <button
                            key={idx}
                            onClick={() => handleClick(idx)}
                            disabled={!isClickable}
                            className={`
                h-20 w-20 rounded-xl border font-mono text-3xl font-bold
                transition-all duration-200
                ${isWinCell
                                    ? cell === "X"
                                        ? "border-primary bg-primary/20 shadow-[0_0_12px_rgba(var(--primary-rgb),0.4)]"
                                        : "border-terminal-cyan bg-terminal-cyan/10 shadow-[0_0_12px_rgba(0,255,234,0.3)]"
                                    : "border-border bg-secondary/30"
                                }
                ${isClickable ? "hover:bg-secondary/60 hover:border-primary/30 active:scale-95 cursor-pointer" : "cursor-default"}
              `}
                        >
                            {cell && (
                                <span className={`${cell === "X" ? "text-primary" : "text-terminal-cyan"} ${isWinCell ? "glow-green" : ""} transition-all`}>
                                    {cell}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="font-mono text-[10px] text-terminal-dim text-center">
                open a window above to dismiss <span className="text-primary">↑</span>
            </div>
        </div>
    )
}
