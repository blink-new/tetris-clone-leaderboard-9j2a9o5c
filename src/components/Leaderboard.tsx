import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'
import { LeaderboardEntry } from '../types/tetris'
import { blink } from '../blink/client'

interface LeaderboardProps {
  currentScore?: number
}

export function Leaderboard({ currentScore }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      // For now, we'll use mock data since database creation failed
      // In a real implementation, this would be:
      // const result = await blink.db.leaderboard.list({
      //   orderBy: { score: 'desc' },
      //   limit: 10
      // })
      
      // Mock data for demonstration
      const mockEntries: LeaderboardEntry[] = [
        {
          id: '1',
          userId: 'user1',
          playerName: 'TetrisKing',
          score: 125000,
          level: 12,
          linesCleared: 120,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: 'user2',
          playerName: 'BlockMaster',
          score: 98000,
          level: 10,
          linesCleared: 95,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          userId: 'user3',
          playerName: 'LineClearing',
          score: 87500,
          level: 9,
          linesCleared: 88,
          createdAt: new Date().toISOString()
        },
        {
          id: '4',
          userId: 'user4',
          playerName: 'SpeedRunner',
          score: 76000,
          level: 8,
          linesCleared: 75,
          createdAt: new Date().toISOString()
        },
        {
          id: '5',
          userId: 'user5',
          playerName: 'PuzzlePro',
          score: 65000,
          level: 7,
          linesCleared: 68,
          createdAt: new Date().toISOString()
        }
      ]
      
      setEntries(mockEntries)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{rank}</span>
    }
  }

  const isCurrentScore = (score: number) => {
    return currentScore !== undefined && score === currentScore
  }

  return (
    <div className="glass-panel rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
        Leaderboard
      </h3>
      
      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No scores yet</p>
              <p className="text-sm text-gray-500">Be the first to play!</p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isCurrentScore(entry.score)
                    ? 'bg-indigo-500/20 border border-indigo-400/30'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index + 1)}
                </div>
                
                <div className="flex-1 ml-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-white text-sm">
                        {entry.playerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        Level {entry.level} • {entry.linesCleared} lines
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-400">
                        {entry.score.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {currentScore !== undefined && !entries.some(e => e.score === currentScore) && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="bg-indigo-500/20 border border-indigo-400/30 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">Your Score</p>
                    <p className="text-xs text-gray-400">Current game</p>
                  </div>
                  <p className="font-bold text-yellow-400">
                    {currentScore.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}