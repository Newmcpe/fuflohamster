import UserAgent from 'user-agents'

export type Fingerprint = {
    main: {
        headers: {
            Accept: string
            'Accept-Language': string
            Connection: string
            Origin: string
            Referer: string
            'Sec-Fetch-Dest': string
            'Sec-Fetch-Mode': string
            'Sec-Fetch-Site': string
            'User-Agent': string
            'X-Requested-With': string
            'Sec-Ch-Ua': string
            'Sec-Ch-Ua-Mobile': string
            'Sec-Ch-Ua-Platform': string
        }

        fingerprint: {
            version: string
            visitorId: string
            components: {
                fonts: {
                    value: string[]
                    duration: number
                }
                domBlockers: {
                    value: any[]
                    duration: number
                }
                fontPreferences: {
                    value: {
                        default: number
                        apple: number
                        serif: number
                        sans: number
                        mono: number
                        min: number
                        system: number
                    }
                    duration: number
                }
                audio: {
                    value: number
                    duration: number
                }
                screenFrame: {
                    value: number[]
                    duration: number
                }
                canvas: null
                osCpu: {
                    duration: number
                }
                languages: {
                    value: string[][]
                    duration: number
                }
                colorDepth: {
                    value: number
                    duration: number
                }
                deviceMemory: {
                    value: number
                    duration: number
                }
                screenResolution: {
                    value: number[]
                    duration: number
                }
                hardwareConcurrency: {
                    value: number
                    duration: number
                }
                timezone: {
                    value: string
                    duration: number
                }
                sessionStorage: {
                    value: boolean
                    duration: number
                }
                localStorage: {
                    value: boolean
                    duration: number
                }
                indexedDB: {
                    value: boolean
                    duration: number
                }
                openDatabase: {
                    value: boolean
                    duration: number
                }
                cpuClass: {
                    duration: number
                }
                platform: {
                    value: string
                    duration: number
                }
                plugins: {
                    value: any[]
                    duration: number
                }
                touchSupport: {
                    value: {
                        maxTouchPoints: number
                        touchEvent: boolean
                        touchStart: boolean
                    }
                    duration: number
                }
                vendor: {
                    value: string
                    duration: number
                }
                vendorFlavors: {
                    value: any[]
                    duration: number
                }
                cookiesEnabled: {
                    value: boolean
                    duration: number
                }
                colorGamut: {
                    value: string
                    duration: number
                }
                invertedColors: {
                    duration: number
                }
                forcedColors: {
                    value: boolean
                    duration: number
                }
                monochrome: {
                    value: number
                    duration: number
                }
                contrast: {
                    value: number
                    duration: number
                }
                reducedMotion: {
                    value: boolean
                    duration: number
                }
                reducedTransparency: {
                    value: boolean
                    duration: number
                }
                hdr: {
                    value: boolean
                    duration: number
                }
                math: {
                    value: {
                        acos: number
                        acosh: number
                        acoshPf: number
                        asin: number
                        asinh: number
                        asinhPf: number
                        atanh: number
                        atanhPf: number
                        atan: number
                        sin: number
                        sinh: number
                        sinhPf: number
                        cos: number
                        cosh: number
                        coshPf: number
                        tan: number
                        tanh: number
                        tanhPf: number
                        exp: number
                        expm1: number
                        expm1Pf: number
                        log1p: number
                        log1pPf: number
                        powPI: number
                    }
                    duration: number
                }
                pdfViewerEnabled: {
                    value: boolean
                    duration: number
                }
                architecture: {
                    value: number
                    duration: number
                }
                applePay: {
                    value: number
                    duration: number
                }
                privateClickMeasurement: {
                    duration: number
                }
                webGlBasics: {
                    value: {
                        version: string
                        vendor: string
                        vendorUnmasked: string
                        renderer: string
                        rendererUnmasked: string
                        shadingLanguageVersion: string
                    }
                    duration: number
                }
                webGlExtensions: null
            }
        }
    }
}

function getRandomFonts(): string[] {
    const fonts = [
        'Arial',
        'Verdana',
        'Helvetica',
        'Tahoma',
        'Times New Roman',
        'Georgia',
        'Garamond',
        'Courier New',
        'Brush Script MT',
        'Lucida Sans',
        'Palatino',
        'Bookman',
        'Avant Garde',
        'Times',
        'Lucida Grande',
        'Geneva',
        'Helvetica Neue',
        'Monaco',
        'Courier',
        'Copperplate',
        'Sand',
        'Lucida',
        'Comic Sans MS',
        'Impact',
        'Charcoal',
        'Tahoma',
        'Geneva',
        'Verdana',
        'Courier New',
        'Lucida Console',
    ]
    for (let i = fonts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[fonts[i], fonts[j]] = [fonts[j], fonts[i]]
    }
    return fonts
}

export function getRandomFingerprint(): Fingerprint {
    const userAgent = new UserAgent({ deviceCategory: 'mobile' })

    return {
        main: {
            headers: {
                Accept: '*/*',
                'Accept-Language': 'ru,ru-RU;q=0.9,en-US;q=0.8,en;q=0.7',
                Connection: 'keep-alive',
                Origin: 'https://hamsterkombat.io',
                Referer: 'https://hamsterkombat.io/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': userAgent.toString(),
                'X-Requested-With': 'org.telegram.messenger',
                'Sec-Ch-Ua':
                    '"Android WebView";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?1',
                'Sec-Ch-Ua-Platform': '"Android"',
            },
            fingerprint: {
                version: '2',
                visitorId:
                    /*Random UUID*/ 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
                        /[xy]/g,
                        function (c) {
                            const r = (Math.random() * 16) | 0
                            const v = c === 'x' ? r : (r & 0x3) | 0x8
                            return v.toString(16)
                        }
                    ),
                components: {
                    fonts: {
                        value: getRandomFonts(),
                        duration: 0,
                    },
                    domBlockers: {
                        value: [],
                        duration: 0,
                    },
                    fontPreferences: {
                        value: {
                            default: Math.floor(Math.random() * 100),
                            apple: Math.floor(Math.random() * 100),
                            serif: Math.floor(Math.random() * 100),
                            sans: Math.floor(Math.random() * 100),
                            mono: Math.floor(Math.random() * 100),
                            min: Math.floor(Math.random() * 100),
                            system: Math.floor(Math.random() * 100),
                        },
                        duration: 0,
                    },
                    audio: {
                        value: Math.random(),
                        duration: Math.random() * 100,
                    },
                    screenFrame: {
                        value: [0, 0, 0, 0],
                        duration: 11,
                    },
                    canvas: null,
                    osCpu: {
                        duration: 0,
                    },
                    languages: {
                        value: [['ru']],
                        duration: 0,
                    },
                    colorDepth: {
                        value: 24,
                        duration: 0,
                    },
                    deviceMemory: {
                        value: Math.floor(Math.random() * 5) + 3,
                        duration: 0,
                    },
                    screenResolution: {
                        value: [
                            userAgent.data.screenWidth,
                            userAgent.data.screenHeight,
                        ],
                        duration: 0,
                    },
                    hardwareConcurrency: {
                        value: Math.floor(Math.random() * 15) + 2,
                        duration: 0,
                    },
                    timezone: {
                        value: 'Europe/Moscow',
                        duration: 0,
                    },
                    sessionStorage: {
                        value: true,
                        duration: 0,
                    },
                    localStorage: {
                        value: true,
                        duration: 0,
                    },
                    indexedDB: {
                        value: true,
                        duration: 0,
                    },
                    openDatabase: {
                        value: false,
                        duration: 0,
                    },
                    cpuClass: {
                        duration: 0,
                    },
                    platform: {
                        value: 'Linux aarch64',
                        duration: 0,
                    },
                    plugins: {
                        value: [],
                        duration: 0,
                    },
                    touchSupport: {
                        value: {
                            maxTouchPoints: 0,
                            touchEvent: false,
                            touchStart: false,
                        },
                        duration: 0,
                    },
                    vendor: {
                        value: 'Google Inc.',
                        duration: 0,
                    },
                    vendorFlavors: {
                        value: [],
                        duration: 0,
                    },
                    cookiesEnabled: {
                        value: true,
                        duration: 0,
                    },
                    colorGamut: {
                        value: 'srgb',
                        duration: 0,
                    },
                    invertedColors: {
                        duration: 0,
                    },
                    forcedColors: {
                        value: false,
                        duration: 0,
                    },
                    monochrome: {
                        value: 0,
                        duration: 0,
                    },
                    contrast: {
                        value: 0,
                        duration: 0,
                    },
                    reducedMotion: {
                        value: false,
                        duration: 0,
                    },
                    reducedTransparency: {
                        value: false,
                        duration: 1,
                    },
                    hdr: {
                        value: false,
                        duration: 0,
                    },
                    math: {
                        value: {
                            acos: 1.4473588658278522,
                            acosh: 709.889355822726,
                            acoshPf: 355.291251501643,
                            asin: 0.12343746096704435,
                            asinh: 0.881373587019543,
                            asinhPf: 0.8813735870195429,
                            atanh: 0.5493061443340548,
                            atanhPf: 0.5493061443340548,
                            atan: 0.4636476090008061,
                            sin: 0.8178819121159085,
                            sinh: 1.1752011936438014,
                            sinhPf: 2.534342107873324,
                            cos: -0.8390715290095377,
                            cosh: 1.5430806348152437,
                            coshPf: 1.5430806348152437,
                            tan: -1.4214488238747245,
                            tanh: 0.7615941559557649,
                            tanhPf: 0.7615941559557649,
                            exp: 2.718281828459045,
                            expm1: 1.718281828459045,
                            expm1Pf: 1.718281828459045,
                            log1p: 2.3978952727983707,
                            log1pPf: 2.3978952727983707,
                            powPI: 1.9275814160560204e-50,
                        },
                        duration: 0,
                    },
                    pdfViewerEnabled: {
                        value: false,
                        duration: 0,
                    },
                    architecture: {
                        value: 127,
                        duration: 0,
                    },
                    applePay: {
                        value: -1,
                        duration: 0,
                    },
                    privateClickMeasurement: {
                        duration: 0,
                    },
                    webGlBasics: {
                        value: {
                            version: 'WebGL 1',
                            vendor: 'Google Inc.',
                            vendorUnmasked: 'Google Inc.',
                            renderer: 'Google SwiftShader',
                            rendererUnmasked: 'Google SwiftShader',
                            shadingLanguageVersion:
                                'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
                        },
                        duration: /*Random from 0 to 100*/ Math.random() * 100,
                    },
                    webGlExtensions: null,
                },
            },
        },
    }
}
