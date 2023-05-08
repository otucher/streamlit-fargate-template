import subprocess


def git_init() -> None:
    subprocess.run(["git", "init", "-b", "main"], check=True)
    subprocess.run(["git", "add", "*"], check=True)
    subprocess.run(["git", "commit", "-m", "Initial commit"], check=True)


def yarn_install() -> None:
    subprocess.run(["yarn", "--cwd", "./cdk", "install"], check=True)


def main() -> None:
    git_init()
    yarn_install()


if __name__ == "__main__":
    main()
