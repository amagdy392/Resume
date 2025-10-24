import React from 'react';
import type { HistoricAnalysisResult } from '../types';
import { useLanguage } from '../hooks/useLocalization';

interface HistoryChartProps {
  history: HistoricAnalysisResult[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ history }) => {
    const { t, language } = useLanguage();
    // history is newest first, reverse it for chronological order
    const data = [...history].reverse(); 

    if (data.length < 2) return null;

    const width = 500;
    const height = 200;
    const padding = 40;
    const textStyle = {
        fontSize: '10px',
        fill: '#64748b'
    };

    const getX = (index: number) => {
        if (data.length === 1) return width / 2;
        return padding + (index / (data.length - 1)) * (width - 2 * padding);
    };

    const getY = (score: number) => {
        return (height - padding) - (score / 100) * (height - 2 * padding);
    };

    const linePath = data
        .map((point, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(point.overallScore)}`)
        .join(' ');

    const yAxisLabels = [0, 25, 50, 75, 100];

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-labelledby="chartTitle" role="img">
                <title id="chartTitle">{t('score_history')}</title>
                {/* Y-axis lines and labels */}
                {yAxisLabels.map(label => (
                    <g key={`y-axis-${label}`}>
                        <line
                            x1={padding}
                            y1={getY(label)}
                            x2={width - padding}
                            y2={getY(label)}
                            stroke="#e2e8f0"
                            strokeDasharray="2,2"
                        />
                        <text
                            x={padding - 10}
                            y={getY(label)}
                            textAnchor="end"
                            alignmentBaseline="middle"
                            style={textStyle}
                        >
                            {label}
                        </text>
                    </g>
                ))}
                
                {/* X-axis labels */}
                {data.map((point, i) => (
                    <text
                        key={`x-axis-${point.date}`}
                        x={getX(i)}
                        y={height - padding + 20}
                        textAnchor="middle"
                        style={textStyle}
                    >
                        {new Date(point.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                    </text>
                ))}

                {/* Data Line */}
                <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2" />

                {/* Data Points with Tooltips */}
                {data.map((point, i) => (
                    <g key={`point-${point.date}`} className="group" role="tooltip" tabIndex={0} aria-label={`${t('score')}: ${point.overallScore}`}>
                        <circle
                            cx={getX(i)}
                            cy={getY(point.overallScore)}
                            r="4"
                            fill="#4f46e5"
                            className="cursor-pointer"
                        />
                         <circle
                            cx={getX(i)}
                            cy={getY(point.overallScore)}
                            r="10"
                            fill="#4f46e5"
                            className="opacity-0 group-hover:opacity-20 transition-opacity"
                        />
                        {/* Tooltip */}
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                             <rect
                                x={getX(i) > width / 2 ? getX(i) - 90 : getX(i) + 10}
                                y={getY(point.overallScore) - 15}
                                width="80"
                                height="25"
                                rx="4"
                                fill="#1e293b"
                            />
                            <text
                                x={getX(i) > width / 2 ? getX(i) - 50 : getX(i) + 50}
                                y={getY(point.overallScore)}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                className="text-xs font-semibold fill-white"
                            >
                                {`${t('score')}: ${point.overallScore}`}
                            </text>
                        </g>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default HistoryChart;
