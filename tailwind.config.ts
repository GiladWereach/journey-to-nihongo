
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Nihongo Journey colors
				indigo: '#2D3047',
				vermilion: '#FF5A5F',
				matcha: '#8C9E5E',
				softgray: '#F2F2F2',
				gold: '#DAA520',
				// Traditional Japanese colors
				gion: {
					night: '#1a1a1a',
					twilight: '#2d2d2d',
					shadow: '#1f1f1f',
					deep: '#0f0f0f',
				},
				wood: {
					light: '#c4a477',
					medium: '#8b4513',
					dark: '#654321',
				},
				paper: {
					warm: '#f5f5f5',
					aged: '#f0e6d2',
					antique: '#e8dcc0',
				},
				lantern: {
					glow: '#ffdc96',
					warm: '#ffc864',
					amber: '#ff8c42',
				},
			},
			fontFamily: {
				sans: ['Noto Sans', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
				japanese: ['Noto Sans JP', 'sans-serif'],
				serif: ['Noto Serif JP', 'serif'],
				traditional: ['Noto Serif JP', 'serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(10px)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'writing': {
					'0%': {
						strokeDashoffset: '1000'
					},
					'100%': {
						strokeDashoffset: '0'
					}
				},
				'slide-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'lantern-glow': {
					'0%': {
						opacity: '0.6',
						boxShadow: '0 0 15px rgba(255, 220, 150, 0.4)'
					},
					'100%': {
						opacity: '1',
						boxShadow: '0 0 25px rgba(255, 220, 150, 0.6)'
					}
				},
				'progress-glow': {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'light-sweep': {
					'0%': { left: '-100%' },
					'100%': { left: '100%' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'fade-out': 'fade-out 0.4s ease-out',
				'scale-in': 'scale-in 0.5s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'writing': 'writing 2s linear forwards',
				'slide-up': 'slide-up 0.6s ease-out',
				'slide-right': 'slide-right 0.6s ease-out',
				'lantern-glow': 'lantern-glow 8s ease-in-out infinite alternate',
				'progress-glow': 'progress-glow 4s ease-in-out infinite',
				'light-sweep': 'light-sweep 0.8s ease',
			},
			backgroundImage: {
				'washi-pattern': "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNmOGY4ZjgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')",
				'traditional-wood': 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(139, 69, 19, 0.08) 50%, rgba(139, 69, 19, 0.05) 100%)',
				'gion-night': 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 30%, #1f1f1f 70%, #0f0f0f 100%)',
				'glass-wood': 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(40, 20, 15, 0.95) 50%, rgba(20, 20, 20, 0.95) 100%)',
				'wood-grain': 'linear-gradient(135deg, rgba(60, 40, 30, 0.9) 0%, rgba(80, 50, 35, 0.9) 100%)',
			},
			boxShadow: {
				'subtle': '0 2px 10px rgba(0, 0, 0, 0.05)',
				'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
				'traditional': '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(139, 69, 19, 0.2)',
				'lantern': '0 0 25px rgba(255, 220, 150, 0.6)',
				'wood': '0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(196, 164, 119, 0.2)',
			},
			backdropBlur: {
				'traditional': '20px',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
