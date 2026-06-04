.PHONY: all start ios android lint format clean fclean re ascii help
.DEFAULT_GOAL := all
ascii:
	@clear
	@printf "\033[36m"
	@cat .ascii.txt
	@printf "\033[0m\n"
	@echo "\033[1;34m================================================================================\033[0m"
	@echo ""

all: ascii
	@echo "\033[1;32mInstalling dependencies...\033[0m"
	pnpm install
	@$(MAKE) android
start: ascii
	@echo "\033[1;32mStarting Expo Development Server...\033[0m"
	pnpm start

ios: ascii
	@echo "\033[1;32mBuilding and running on iOS Simulator...\033[0m"
	pnpm ios

android: ascii
	@echo "\033[1;32mBuilding and running on Android Emulator...\033[0m"
	pnpm android

lint: ascii
	@echo "\033[1;33mRunning ESLint...\033[0m"
	pnpm lint

format: ascii
	@echo "\033[1;33mFormatting code with Prettier...\033[0m"
	pnpm format

clean: ascii
	@echo "\033[1;31mCleaning Expo cache and watchman...\033[0m"
	rm -rf .expo
	watchman watch-del-all || true
	pnpm store prune

fclean: clean
	@echo "\033[1;31mRemoving node_modules and reinstalling dependencies...\033[0m"
	rm -rf node_modules
	pnpm install

re: fclean all

help: ascii
	@echo "\033[1;32mAvailable commands:\033[0m"
	@echo "  \033[36mstart\033[0m     - Start Expo Development Server"
	@echo "  \033[36mios\033[0m       - Build and run on iOS Simulator"
	@echo "  \033[36mandroid\033[0m   - Build and run on Android Emulator"
	@echo "  \033[36mlint\033[0m      - Run ESLint to check code quality"
	@echo "  \033[36mformat\033[0m    - Format code with Prettier"
	@echo "  \033[36mclean\033[0m     - Clean Expo cache and watchman"
	@echo "  \033[36mfclean\033[0m    - Remove node_modules and reinstall everything"
	@echo "  \033[36mre\033[0m        - Run fclean then all"
	@echo "  \033[36mhelp\033[0m      - Display this help message"
	@echo ""
