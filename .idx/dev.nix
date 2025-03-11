{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
      pkgs.util-linux
  ];
   env = {
    #TODO Get a API key from https://g.co/ai/idxGetGeminiKey 
    GOOGLE_GENAI_API_KEY = ""; 
  };
  idx.extensions = [
       # "vscodevim.vim"
      # "golang.go"
    "svelte.svelte-vscode"
    "vue.volar"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}

# { pkgs, ... }:
# {
#   channel = "stable-24.05";  # or "unstable"
#   packages = [
#     pkgs.nodejs_20
#     pkgs.util-linux
#   ];

#   # Environment variables
#   env = {
#     # Provide your Gemini API key if desired, or set it at runtime
#     GOOGLE_GENAI_API_KEY = "";
#   };

#   idx = {
#     # VS Code / OpenVSX Extensions
#     extensions = [
#       # e.g. "svelte.svelte-vscode"
#       # e.g. "vue.volar"
#     ];

#     # Hooks that run on workspace creation / startup
#     workspace = {
#       onCreate = {
#         # Install dependencies for both frontend & backend
#         install-frontend = ''
#           cd frontend
#           npm ci --no-audit --prefer-offline --no-progress --timing
#         '';
#         install-backend = ''
#           cd backend
#           npm ci --no-audit --prefer-offline --no-progress --timing
#         '';

#         # Open files on first creation (optional)
#         default.openFiles = [
#           "README.md"
#           "backend/index.ts"
#         ];
#       };

#       onStart = {
#         # Start your Genkit backend on workspace (re)start
#         run-backend = ''
#           cd backend
#           # If no API key is set, ask user
#           if [ -z "${GOOGLE_GENAI_API_KEY}" ]; then
#             echo "No Gemini API key detected, enter a Gemini API key from https://aistudio.google.com/app/apikey:"
#             read -s GOOGLE_GENAI_API_KEY
#             echo "You can also add to .idx/dev.nix to automatically add to your workspace"
#             export GOOGLE_GENAI_API_KEY
#           fi
#           npm run genkit:dev
#         '';
#       };
#     };

#     # "Previews" let you spin up a web preview for your frontend
#     previews = {
#       previews = {
#         # A 'web' preview for your React/Vite app
#         web = {
#           command = [
#             "npm"
#             "run"
#             "dev"
#             "--"
#             "--port"
#             "$PORT"
#             "--host"
#             "0.0.0.0"
#           ];
#           manager = "web";
#           workingDirectory = "frontend";
#         };
#       };
#     };
#   };
# }
