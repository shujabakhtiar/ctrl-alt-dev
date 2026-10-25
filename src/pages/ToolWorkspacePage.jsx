import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Code2, 
  Binary, 
  Palette, 
  Grid, 
  Archive, 
  FileText,
  Upload,
  Download
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ToolTile from '../components/tools/ToolTile';

export default function ToolWorkspacePage() {
  const { toolId } = useParams();
  const [copied, setCopied] = useState(false);

  // JSON Formatter state
  const [jsonInput, setJsonInput] = useState(`{
  "project": "DevToolkit",
  "version": "1.0.0",
  "features": ["100% Client-Side", "Fast", "Zero Uploads"],
  "stats": {
    "speed": "instant",
    "privacy": 100
  }
}`);
  const [jsonError, setJsonError] = useState(null);

  // Base64 state
  const [base64Text, setBase64Text] = useState('Welcome to DevToolkit 2026!');
  const [base64Output, setBase64Output] = useState(() => btoa('Welcome to DevToolkit 2026!'));
  const [base64Image, setBase64Image] = useState(null);

  // Color Picker state
  const [selectedColor, setSelectedColor] = useState('#C8FF43');

  // Text Formatter state
  const [textInput, setTextInput] = useState('  DevToolkit is a collection of fast, practical tools for frontend developers.  ');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonFormat = (minify = false) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, minify ? 0 : 2));
      setJsonError(null);
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleBase64File = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64Output(e.target.result);
      if (file.type.startsWith('image/')) {
        setBase64Image(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Tool details configuration
  const toolConfigs = {
    'json-formatter': {
      title: 'JSON Formatter & Validator',
      color: 'yellow',
      icon: <Code2 className="w-5 h-5" />,
      desc: 'Beautify, validate, or minify your JSON payloads instantly in your browser.',
    },
    'image-to-base64': {
      title: 'Image to Base64 Converter',
      color: 'pink',
      icon: <Binary className="w-5 h-5" />,
      desc: 'Encode any image directly into a Data URL for inline CSS or HTML without external requests.',
    },
    'color-picker': {
      title: 'Retro Color Picker & Inspector',
      color: 'cyan',
      icon: <Palette className="w-5 h-5" />,
      desc: 'Pick, convert, and inspect color values between HEX, RGB, and HSL.',
    },
    'text-formatter': {
      title: 'Text & Code Formatter',
      color: 'purple',
      icon: <FileText className="w-5 h-5" />,
      desc: 'Trim, clean, uppercase/lowercase, and format text strings at lightning speed.',
    },
    'background-remover': {
      title: 'Background Remover',
      color: 'blue',
      icon: <Grid className="w-5 h-5" />,
      desc: 'Fast client-side background removal studio for icons and photos.',
    },
    'file-compressor': {
      title: 'File Compressor',
      color: 'orange',
      icon: <Archive className="w-5 h-5" />,
      desc: 'Zip and bundle developer assets locally with zero server latency.',
    },
  };

  const currentConfig = toolConfigs[toolId] || {
    title: 'Developer Tool Workspace',
    color: 'lime',
    icon: <Code2 className="w-5 h-5" />,
    desc: 'Interactive developer utility.',
  };

  return (
    <div className="max-w-4xl mx-auto py-2">
      {/* Breadcrumb / Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#AAB7D0] hover:text-[#C8FF43] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO POPULAR TOOLS</span>
        </Link>
      </div>

      {/* Workspace Header */}
      <div className="bg-[#111620] border border-[#2A3242] rounded-[10px] p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_4px_0_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-4">
          <ToolTile color={currentConfig.color} icon={currentConfig.icon} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-['Space_Grotesk',sans-serif] font-bold text-xl sm:text-2xl text-[#F4F2EC]">
                {currentConfig.title}
              </h1>
              <Badge variant={currentConfig.color}>CLIENT-SIDE</Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#AAB7D0]">
              {currentConfig.desc}
            </p>
          </div>
        </div>
      </div>

      {/* JSON Formatter Workspace */}
      {toolId === 'json-formatter' && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#2A3242]">
            <div className="flex items-center gap-2">
              <Button
                variant="yellow"
                size="sm"
                onClick={() => handleJsonFormat(false)}
              >
                Beautify / Format
              </Button>
              <Button
                variant="dark"
                size="sm"
                onClick={() => handleJsonFormat(true)}
              >
                Minify JSON
              </Button>
            </div>

            <Button
              variant="dark"
              size="sm"
              icon={copied ? <Check className="w-4 h-4 text-[#C8FF43]" /> : <Copy className="w-4 h-4" />}
              onClick={() => copyToClipboard(jsonInput)}
            >
              {copied ? 'Copied!' : 'Copy JSON'}
            </Button>
          </div>

          {jsonError && (
            <div className="p-3 bg-[#F05CE8]/15 border border-[#F05CE8]/40 rounded-[6px] font-mono text-xs text-[#F05CE8]">
              Error: {jsonError}
            </div>
          )}

          <div className="relative">
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setJsonError(null);
              }}
              rows={16}
              className="w-full bg-[#080A0F] border border-[#2A3242] focus:border-[#FFD84D] focus:outline-none rounded-[6px] p-4 font-mono text-xs text-[#F4F2EC] leading-relaxed resize-y selection:bg-[#FFD84D] selection:text-[#080A0F]"
              placeholder="Paste your JSON here..."
              spellCheck={false}
            />
          </div>
        </Card>
      )}

      {/* Base64 Workspace */}
      {toolId === 'image-to-base64' && (
        <Card className="flex flex-col gap-6">
          {/* File Drop Area */}
          <label className="border-2 border-dashed border-[#2A3242] hover:border-[#F05CE8] bg-[#080A0F]/60 rounded-[8px] p-8 text-center flex flex-col items-center justify-center cursor-pointer transition-colors group">
            <Upload className="w-8 h-8 text-[#7886A1] group-hover:text-[#F05CE8] mb-3 transition-colors" />
            <span className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[#F4F2EC] mb-1">
              Select or Drop an Image
            </span>
            <span className="text-xs text-[#7886A1]">
              PNG, JPG, SVG, WebP, GIF (Max 10MB)
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleBase64File(e.target.files[0])}
            />
          </label>

          {base64Image && (
            <div className="flex items-center gap-4 p-4 bg-[#080A0F] border border-[#2A3242] rounded-[6px]">
              <img
                src={base64Image}
                alt="Preview"
                className="w-16 h-16 object-cover rounded border border-[#2A3242]"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-mono text-[#F05CE8] font-bold block mb-1">
                  Ready to copy Data URL
                </span>
                <span className="text-xs font-mono text-[#7886A1] block truncate">
                  {base64Output.slice(0, 60)}...
                </span>
              </div>
              <Button
                variant="pink"
                size="sm"
                icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                onClick={() => copyToClipboard(base64Output)}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#AAB7D0]">Base64 Output:</span>
              <Button
                variant="dark"
                size="sm"
                icon={copied ? <Check className="w-4 h-4 text-[#C8FF43]" /> : <Copy className="w-4 h-4" />}
                onClick={() => copyToClipboard(base64Output)}
              >
                {copied ? 'Copied' : 'Copy String'}
              </Button>
            </div>
            <textarea
              readOnly
              value={base64Output}
              rows={8}
              className="w-full bg-[#080A0F] border border-[#2A3242] rounded-[6px] p-3 font-mono text-xs text-[#AAB7D0] leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </Card>
      )}

      {/* Color Picker Workspace */}
      {toolId === 'color-picker' && (
        <Card className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center gap-4 p-6 bg-[#080A0F] border border-[#2A3242] rounded-[8px]">
              <div
                className="w-32 h-32 rounded-[12px] border-2 border-white/20 shadow-[0_6px_0_rgba(0,0,0,0.8)] transition-colors"
                style={{ backgroundColor: selectedColor }}
              />
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer bg-transparent"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#7886A1] block mb-1">HEX VALUE</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="flex-1 bg-[#080A0F] border border-[#2A3242] rounded-[6px] px-3 py-2 font-mono text-sm text-[#F4F2EC]"
                  />
                  <Button
                    variant="cyan"
                    size="sm"
                    onClick={() => copyToClipboard(selectedColor)}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#7886A1] block mb-1">CSS VARIABLE</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`--color-brand: ${selectedColor};`}
                    className="flex-1 bg-[#080A0F] border border-[#2A3242] rounded-[6px] px-3 py-2 font-mono text-sm text-[#AAB7D0]"
                  />
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => copyToClipboard(`--color-brand: ${selectedColor};`)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Text Formatter Workspace */}
      {toolId === 'text-formatter' && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-[#2A3242]">
            <Button
              variant="purple"
              size="sm"
              onClick={() => setTextInput(textInput.toUpperCase())}
            >
              UPPERCASE
            </Button>
            <Button
              variant="dark"
              size="sm"
              onClick={() => setTextInput(textInput.toLowerCase())}
            >
              lowercase
            </Button>
            <Button
              variant="dark"
              size="sm"
              onClick={() => setTextInput(textInput.trim())}
            >
              Trim Whitespace
            </Button>
            <Button
              variant="dark"
              size="sm"
              onClick={() => setTextInput(encodeURIComponent(textInput))}
            >
              URL Encode
            </Button>
            <Button
              variant="dark"
              size="sm"
              icon={copied ? <Check className="w-4 h-4 text-[#C8FF43]" /> : <Copy className="w-4 h-4" />}
              className="ml-auto"
              onClick={() => copyToClipboard(textInput)}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={10}
            className="w-full bg-[#080A0F] border border-[#2A3242] focus:border-[#795BFF] focus:outline-none rounded-[6px] p-4 font-mono text-xs text-[#F4F2EC] leading-relaxed resize-y"
            placeholder="Type or paste your text here..."
          />
        </Card>
      )}

      {/* Background Remover & File Compressor placeholders */}
      {(toolId === 'background-remover' || toolId === 'file-compressor') && (
        <Card className="text-center py-12 flex flex-col items-center">
          <div className="w-16 h-16 rounded-[12px] bg-[#171D29] border border-[#2A3242] flex items-center justify-center mb-4">
            {currentConfig.icon}
          </div>
          <h2 className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-[#F4F2EC] mb-2">
            Local Browser Engine
          </h2>
          <p className="text-xs text-[#AAB7D0] max-w-md mb-6 leading-relaxed">
            This module processes directly in your client browser using WebAssembly. For full image optimization and format conversion, explore our flagship converter.
          </p>
          <Button
            to="/image-convertor/to-webp"
            variant="lime"
            size="md"
          >
            Launch WebP Studio
          </Button>
        </Card>
      )}
    </div>
  );
}
